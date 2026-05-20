import React from "react";
import { Eye, Check, X, DollarSign, FileText } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const ReimbursementTable = ({ claims, onAction, onView, loading }) => {
    const { currencySymbol } = useOrganization();
    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
            case "APPROVED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
            case "PAID": return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="w-full h-40 flex items-center justify-center text-muted-foreground">
                <span className="animate-pulse">Loading reimbursements...</span>
            </div>
        );
    }

    if (claims.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center text-muted-foreground border rounded-xl bg-muted/20">
                <FileText className="h-8 w-8 mb-2 opacity-50" />
                <p>No reimbursement requests found.</p>
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
                    <tbody className="divide-y">
                        {claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-foreground">
                                        {claim.employee?.firstName} {claim.employee?.lastName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {claim.employee?.department?.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-md bg-muted font-medium text-xs">
                                        {claim.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(claim.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {currencySymbol}{claim.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(claim.status)}`}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(claim)}
                                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>

                                        {claim.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => onAction(claim.id, "APPROVE")}
                                                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onAction(claim.id, "REJECT")}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}

                                        {claim.status === "APPROVED" && (
                                            <button
                                                onClick={() => onAction(claim.id, "PAY")}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-xs font-bold"
                                            >
                                                <DollarSign className="h-3 w-3" />
                                                Pay
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

export default ReimbursementTable;
