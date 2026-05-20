import React, { useState } from "react";
import { X, Calendar, Wallet, CheckCircle, AlertCircle, Archive, DollarSign } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const AdvanceModal = ({ advance, onClose, onAction }) => {
    const { currencySymbol } = useOrganization();
    const [rejectReason, setRejectReason] = useState("");
    const [confirmingReject, setConfirmingReject] = useState(false);

    if (!advance) return null;

    const handleReject = () => {
        if (!confirmingReject) {
            setConfirmingReject(true);
        } else {
            if (!rejectReason.trim()) return;
            onAction(advance.id, "REJECT", { reason: rejectReason });
            setConfirmingReject(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg border overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-lg">Advance Request Details</h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors" aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold">{advance.employee?.firstName} {advance.employee?.lastName}</h2>
                            <p className="text-sm text-muted-foreground">{advance.employee?.department?.name}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-primary">{currencySymbol}{advance.amount.toLocaleString()}</h2>
                            <span className="text-xs px-2 py-1 rounded bg-muted font-medium uppercase tracking-wide">
                                {advance.advanceType || "SALARY"}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs font-bold uppercase">Requested Date</span>
                            </div>
                            <p className="font-medium">{new Date(advance.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <CheckCircle className="h-3 w-3" />
                                <span className="text-xs font-bold uppercase">Status</span>
                            </div>
                            <p className="font-medium">{advance.status}</p>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Reason</h4>
                        <div className="p-4 rounded-lg border bg-muted/10 text-sm">
                            {advance.reason}
                        </div>
                    </div>

                    {/* Rejection Reason Display */}
                    {advance.status === "REJECTED" && advance.rejectionReason && (
                        <div>
                            <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Rejection Reason</h4>
                            <div className="p-4 rounded-lg border border-red-100 bg-red-50 text-sm text-red-700">
                                {advance.rejectionReason}
                            </div>
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

                    {advance.status === "PENDING" && !confirmingReject && (
                        <>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => onAction(advance.id, "APPROVE")}
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

                    {advance.status === "APPROVED" && (
                        <button
                            onClick={() => onAction(advance.id, "DISBURSE")}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-opacity shadow-sm flex items-center gap-2"
                        >
                            <DollarSign className="h-4 w-4" />
                            Mark as Disbursed
                        </button>
                    )}

                    {advance.status === "DISBURSED" && (
                        <button
                            onClick={() => onAction(advance.id, "CLOSE")}
                            className="px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-bold hover:bg-gray-700 transition-opacity shadow-sm flex items-center gap-2"
                        >
                            <Archive className="h-4 w-4" />
                            Close Advance
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvanceModal;
