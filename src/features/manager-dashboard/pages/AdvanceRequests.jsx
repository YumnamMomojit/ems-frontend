import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import StatusBadge from "../components/StatusBadge";
import { format } from "date-fns";
import { Check, X, HandCoins } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { useOrganization } from "~/hooks/OrganizationContext";

const AdvanceRequests = () => {
    const { currencySymbol } = useOrganization();
    const [advances, setAdvances] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchAdvances = async () => {
        setLoading(true);
        try {
            const data = await managerService.getTeamAdvances();
            setAdvances(data);
        } catch (err) {
            console.error("Advances fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvances();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await managerService.updateAdvanceStatus(id, status);
            toast({ title: `Request ${status.toLowerCase()}`, description: `Action processed successfully.` });
            fetchAdvances();
        } catch (err) {
            toast({ title: "Action failed", description: "Failed to update request.", variant: "destructive" });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Advance Requests</h1>
                <p className="text-muted-foreground">Recommend or reject team advance salary applications.</p>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Repayment (Months)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">Loading requests...</td>
                                </tr>
                            ) : advances.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No advance requests found.</td>
                                </tr>
                            ) : (
                                advances.map((request) => (
                                    <tr key={request.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {request.employee.firstName} {request.employee.lastName}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-primary">{currencySymbol}{request.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={request.reason}>{request.reason}</td>
                                        <td className="px-6 py-4 text-center">{request.repaymentMonths || "-"}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={request.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {request.status === "PENDING" && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(request.id, "APPROVED")}
                                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Approve / Recommend"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(request.id, "REJECTED")}
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

export default AdvanceRequests;
