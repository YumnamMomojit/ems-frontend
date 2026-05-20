import React from "react";
import { X, DollarSign, Save } from "lucide-react";

const PayrollDrawer = ({ employee, details, onClose, isOpen }) => {
    if (!isOpen) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-border flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-card">
                    <h2 className="text-lg font-bold">Payroll Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Employee Profile */}
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                            {employee?.employee.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{employee?.employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee?.employee.designation} • {employee?.employee.department}</p>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                                    {employee?.employee.code}
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-border" />

                    {/* Earnings Section */}
                    <div>
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Earnings</h4>
                        <div className="space-y-3">
                            {details?.earnings?.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-foreground">{item.label}</span>
                                    <span className="font-semibold text-green-700">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                            <div className="pt-2 border-t flex justify-between items-center font-bold">
                                <span>Gross Earnings</span>
                                <span className="text-green-700">
                                    {formatCurrency(details?.earnings?.reduce((a, b) => a + b.amount, 0) || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div>
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Deductions</h4>
                        <div className="space-y-3">
                            {details?.deductions?.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-foreground">{item.label}</span>
                                    <span className="font-semibold text-red-600">-{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                            <div className="pt-2 border-t flex justify-between items-center font-bold">
                                <span>Total Deductions</span>
                                <span className="text-red-700">
                                    -{formatCurrency(details?.deductions?.reduce((a, b) => a + b.amount, 0) || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Manual Adjustment */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-border">
                        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Manual Adjustment
                        </h4>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Amount (+/-)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Reason (Mandatory)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bonus"
                                    className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                            <Save className="h-4 w-4" />
                            Update Adjustment
                        </button>
                    </div>

                    {/* Net Pay Highlight */}
                    <div className="bg-primary/5 p-6 rounded-xl text-center border border-primary/10">
                        <p className="text-sm text-muted-foreground mb-1">Net Payable Salary</p>
                        <h2 className="text-3xl font-bold text-primary">{formatCurrency(details?.netPay || 0)}</h2>
                        <p className="text-xs text-muted-foreground mt-2">Disbursed via Bank Transfer</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PayrollDrawer;
