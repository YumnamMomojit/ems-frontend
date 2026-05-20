import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import StatusBadge from "../components/StatusBadge";
import { format } from "date-fns";
import { Check, X, ExternalLink } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { useOrganization } from "~/hooks/OrganizationContext";

const Reimbursements = () => {
    const { currencySymbol } = useOrganization();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const data = await managerService.getTeamReimbursements();
            setClaims(data);
        } catch (err) {
            console.error("Claims fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await managerService.approveReimbursement(id, status);
            toast({ title: `Claim ${status.toLowerCase()}`, description: `Action processed successfully.` });
            fetchClaims();
        } catch (err) {
            toast({ title: "Action failed", description: "Failed to update claim status.", variant: "destructive" });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Reimbursement Approval</h1>
                <p className="text-muted-foreground">Verify and process team expense claims.</p>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Bill</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-muted-foreground">Loading claims...</td>
                                </tr>
                            ) : claims.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-muted-foreground">No insurance claims found.</td>
                                </tr>
                            ) : (
                                claims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {claim.employee.firstName} {claim.employee.lastName}
                                        </td>
                                        <td className="px-6 py-4">{claim.type}</td>
                                        <td className="px-6 py-4 font-bold text-primary">{currencySymbol}{claim.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{format(new Date(claim.createdAt), "MMM dd, yyyy")}</td>
                                        <td className="px-6 py-4">
                                            {claim.billUrl ? (
                                                <a
                                                    href={claim.billUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    View Bill <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : "None"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={claim.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {claim.status === "PENDING" && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(claim.id, "APPROVED")}
                                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(claim.id, "REJECTED")}
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

export default Reimbursements;
