import React, { useState } from "react";
import { X, Calendar, DollarSign, FileText, CheckCircle, AlertCircle, Receipt } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const ReimbursementModal = ({ claim, onClose, onAction }) => {
    const { currencySymbol } = useOrganization();
    const [rejectReason, setRejectReason] = useState("");
    const [confirmingReject, setConfirmingReject] = useState(false);

    if (!claim) return null;

    const handleReject = () => {
        if (!confirmingReject) {
            setConfirmingReject(true);
        } else {
            if (!rejectReason.trim()) return;
            onAction(claim.id, "REJECT", { reason: rejectReason });
            setConfirmingReject(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg border overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-lg">Claim Details</h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold">{claim.employee?.firstName} {claim.employee?.lastName}</h2>
                            <p className="text-sm text-muted-foreground">{claim.employee?.department?.name}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-primary">{currencySymbol}{claim.amount.toLocaleString()}</h2>
                            <span className="text-xs px-2 py-1 rounded bg-muted font-medium uppercase tracking-wide">
                                {claim.type}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs font-bold uppercase">Expense Date</span>
                            </div>
                            <p className="font-medium">{new Date(claim.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <CheckCircle className="h-3 w-3" />
                                <span className="text-xs font-bold uppercase">Status</span>
                            </div>
                            <p className="font-medium">{claim.status}</p>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Reason</h4>
                        <div className="p-4 rounded-lg border bg-muted/10 text-sm">
                            {claim.reason}
                        </div>
                    </div>

                    {/* Bill Preview */}
                    {claim.billUrl && (
                        <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Attached Receipt</h4>
                            <a
                                href={claim.billUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                            >
                                <div className="p-2 rounded bg-primary/10 text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">View Receipt</p>
                                    <p className="text-xs text-muted-foreground">Click to open in new tab</p>
                                </div>
                            </a>
                        </div>
                    )}

                    {/* Rejection Reason Input */}
                    {confirmingReject && (
                        <div className="animate-in slide-in-from-top-2">
                            <label className="text-sm font-medium text-red-600 mb-1 block">Reason for Rejection *</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter reason..."
                                className="w-full border-red-200 rounded-lg p-2 text-sm focus:ring-red-500 focus:border-red-500 min-h-[80px]"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Close
                    </button>

                    {claim.status === "PENDING" && !confirmingReject && (
                        <>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => onAction(claim.id, "APPROVE")}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
                            >
                                Approve Request
                            </button>
                        </>
                    )}

                    {confirmingReject && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setConfirmingReject(false); setRejectReason(""); }}
                                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-opacity shadow-sm"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    )}

                    {claim.status === "APPROVED" && (
                        <button
                            onClick={() => onAction(claim.id, "PAY")}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-opacity shadow-sm flex items-center gap-2"
                        >
                            <DollarSign className="h-4 w-4" />
                            Mark as Paid
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReimbursementModal;
