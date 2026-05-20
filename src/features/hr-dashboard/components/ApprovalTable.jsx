import React from "react";
import { Check, X, Eye } from "lucide-react";
import StatusBadge from "../../manager-dashboard/components/StatusBadge";
import { format } from "date-fns";
import { useOrganization } from "~/hooks/OrganizationContext";

const ApprovalTable = ({ data, type, onApprove, onReject, onView, loading }) => {
    const { currencySymbol } = useOrganization();
    const getColumns = () => {
        switch (type) {
            case "leave":
                return ["Employee", "Type", "Start Date", "End Date", "Status", "Actions"];
            case "reimbursement":
                return ["Employee", "Type", "Amount", "Reason", "Status", "Actions"];
            case "advance":
                return ["Employee", "Amount", "Reason", "Repayment", "Status", "Actions"];
            default:
                return [];
        }
    };

    const columns = getColumns();

    return (
        <div className="border rounded-xl shadow-sm overflow-hidden universal-card-child">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b text-sm font-medium">
                        <tr>
                            {columns.map((col) => (
                                <th key={col} className="px-6 py-4">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">Loading...</td>
                            </tr>
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">No pending requests found.</td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        {item.employee.firstName} {item.employee.lastName}
                                    </td>

                                    {type === "leave" && (
                                        <>
                                            <td className="px-6 py-4 capitalize">{item.type.toLowerCase()}</td>
                                            <td className="px-6 py-4">{format(new Date(item.startDate), "MMM dd, yyyy")}</td>
                                            <td className="px-6 py-4">{format(new Date(item.endDate), "MMM dd, yyyy")}</td>
                                        </>
                                    )}

                                    {type === "reimbursement" && (
                                        <>
                                            <td className="px-6 py-4 capitalize">{item.type.toLowerCase()}</td>
                                            <td className="px-6 py-4 font-bold text-primary">{currencySymbol}{item.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 max-w-xs truncate">{item.reason}</td>
                                        </>
                                    )}

                                    {type === "advance" && (
                                        <>
                                            <td className="px-6 py-4 font-bold text-primary">{currencySymbol}{item.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 max-w-xs truncate">{item.reason}</td>
                                            <td className="px-6 py-4 text-center">{item.repaymentMonths || "-"}</td>
                                        </>
                                    )}

                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(item)}
                                                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            )}
                                            {item.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => onApprove(item.id)}
                                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(item.id)}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalTable;
