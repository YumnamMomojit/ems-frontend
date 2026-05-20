import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import StatusBadge from "../components/StatusBadge";
import { format } from "date-fns";
import { Check, X, AlertCircle } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

const LeaveApprovals = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const data = await managerService.getTeamLeaves();
            setLeaves(data);
        } catch (err) {
            console.error("Leave fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await managerService.approveLeave(id, status);
            toast({
                title: `Leave ${status.toLowerCase()}`,
                description: `Successfully ${status.toLowerCase()} the leave request.`,
            });
            fetchLeaves();
        } catch (err) {
            toast({
                title: "Action failed",
                description: "Failed to update leave status.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Leave Approvals</h1>
                <p className="text-muted-foreground">Review and manage team leave requests.</p>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">
                                        Loading leave requests...
                                    </td>
                                </tr>
                            ) : leaves.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">
                                        No leave requests found.
                                    </td>
                                </tr>
                            ) : (
                                leaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {leave.employee.firstName} {leave.employee.lastName}
                                        </td>
                                        <td className="px-6 py-4">{leave.type}</td>
                                        <td className="px-6 py-4">
                                            {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={leave.reason}>
                                            {leave.reason || "No reason provided"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={leave.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {leave.status === "PENDING" && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(leave.id, "APPROVED")}
                                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(leave.id, "REJECTED")}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveApprovals;
