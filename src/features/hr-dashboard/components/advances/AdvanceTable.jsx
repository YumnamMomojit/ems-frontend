import React from "react";
import { Eye, Check, X, DollarSign, Wallet, Archive } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const AdvanceTable = ({ advances, onAction, onView, loading }) => {
    const { currencySymbol } = useOrganization();
    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
            case "APPROVED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "DISBURSED": return "bg-purple-100 text-purple-700 border-purple-200";
            case "CLOSED": return "bg-gray-100 text-gray-700 border-gray-200";
            case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="w-full h-40 flex items-center justify-center text-muted-foreground">
                <span className="animate-pulse">Loading advance requests...</span>
            </div>
        );
    }

    if (advances.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center text-muted-foreground border rounded-xl bg-muted/20">
                <Wallet className="h-8 w-8 mb-2 opacity-50" />
                <p>No advance requests found.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-xl shadow-sm overflow-hidden bg-background">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y relative">
                        {advances.map((advance) => (
                            <tr key={advance.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-foreground">
                                        {advance.employee?.firstName} {advance.employee?.lastName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {advance.employee?.department?.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-md bg-muted font-medium text-xs">
                                        {advance.advanceType || "SALARY"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(advance.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {currencySymbol}{advance.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(advance.status)}`}>
                                        {advance.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(advance)}
                                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>

                                        {advance.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => onAction(advance.id, "APPROVE")}
                                                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onAction(advance.id, "REJECT")}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}

                                        {advance.status === "APPROVED" && (
                                            <button
                                                onClick={() => onAction(advance.id, "DISBURSE")}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-bold"
                                                title="Mark as Disbursed"
                                            >
                                                <DollarSign className="h-3 w-3" />
                                                Disburse
                                            </button>
                                        )}

                                        {advance.status === "DISBURSED" && (
                                            <button
                                                onClick={() => onAction(advance.id, "CLOSE")}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors text-xs font-bold"
                                                title="Close Advance"
                                            >
                                                <Archive className="h-3 w-3" />
                                                Close
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdvanceTable;
