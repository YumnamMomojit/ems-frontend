import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployeeLeaves, applyLeave } from "~/services/employee.api";
import { toast } from "react-toastify";
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const Leaves = () => {
    const queryClient = useQueryClient();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const { data: leavesData, isLoading, isError } = useQuery({
        queryKey: ["employeeLeaves"],
        queryFn: getEmployeeLeaves,
    });

    const applyLeaveMutation = useMutation({
        mutationFn: applyLeave,
        onSuccess: () => {
            queryClient.invalidateQueries(["employeeLeaves"]);
            toast.success("Leave application submitted successfully!");
            setIsApplyModalOpen(false);
            setFormData({ leaveType: "Casual", startDate: "", endDate: "", reason: "" });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to apply for leave");
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.startDate) {
            toast.error("Please select start date");
            return;
        }
        if (!formData.endDate) {
            toast.error("Please select end date");
            return;
        }
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            toast.error("End date cannot be before start date");
            return;
        }
        if (!formData.reason.trim()) {
            toast.error("Please provide a reason for leave");
            return;
        }
        if (formData.reason.trim().length < 10) {
            toast.error("Reason must be at least 10 characters");
            return;
        }

        applyLeaveMutation.mutate(formData);
    };

    // Derived state for balances (assuming backend returns { balances: {...}, history: [...] })
    // If backend only returns history, we might need to calculate logic or mock balances if not provided.
    // For now, let's assume the API returns an object with `balances` and `leaves`.
    const balances = leavesData?.balances || { casual: 0, sick: 0, earned: 0 };
    const leaveHistory = leavesData?.leaves || [];

    if (isLoading) return <div className="p-6">Loading leaves...</div>;
    if (isError) return <div className="p-6">Error loading leaves data.</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved": return "text-green-600 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800";
            case "Rejected": return "text-red-600 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800";
            default: return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Approved": return <CheckCircle className="w-4 h-4" />;
            case "Rejected": return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Leaves</h1>
                    <p className="text-muted-foreground">Manage your leaves and view history</p>
                </div>
                <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4" /> Apply Leave
                </button>
            </div>

            {/* Leave Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Casual Leave</p>
                            <h3 className="text-3xl font-bold text-foreground mt-2">{balances.casual}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">Available</div>
                </div>
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Sick Leave</p>
                            <h3 className="text-3xl font-bold text-foreground mt-2">{balances.sick}</h3>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">Available</div>
                </div>
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Earned Leave</p>
                            <h3 className="text-3xl font-bold text-foreground mt-2">{balances.earned}</h3>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">Available</div>
                </div>
            </div>

            {/* Leave History */}
            <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Leave History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Dates</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Reason</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Applied On</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {leaveHistory.length > 0 ? (
                                leaveHistory.map((leave, index) => (
                                    <tr key={index} className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4 font-medium text-foreground">{leave.leaveType}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(leave.startDate), "MMM dd, yyyy")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground truncate max-w-xs" title={leave.reason}>{leave.reason}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {leave.appliedOn ? format(new Date(leave.appliedOn), "MMM dd, yyyy") : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                                                {getStatusIcon(leave.status)}
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        No leave history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Apply Leave Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card dark:bg-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">Apply for Leave</h2>
                            <button
                                onClick={() => setIsApplyModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Leave Type</label>
                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                >
                                    <option value="Casual">Casual Leave</option>
                                    <option value="Sick">Sick Leave</option>
                                    <option value="Earned">Earned Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Reason</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    placeholder="Brief reason for leave..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={applyLeaveMutation.isPending}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/30"
                                >
                                    {applyLeaveMutation.isPending ? "Submitting..." : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaves;
