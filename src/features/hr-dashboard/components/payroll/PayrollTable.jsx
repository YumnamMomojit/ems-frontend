import React from "react";
import { MoreHorizontal, AlertCircle, CheckCircle } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const PayrollTable = ({ employees, loading, onRowClick }) => {
    const { currencySymbol } = useOrganization();
    if (loading) {
        return (
            <div className="bg-card border rounded-xl overflow-hidden">
                <div className="p-4 border-b">
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 w-full bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return `${currencySymbol}${amount.toLocaleString()}`;
    };

    return (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-lg font-bold">Employee Payroll</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4 text-center">Paid Days</th>
                            <th className="px-6 py-4 text-right">Earnings</th>
                            <th className="px-6 py-4 text-right">Deductions</th>
                            <th className="px-6 py-4 text-right">Net Salary</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {employees.map((emp) => (
                            <tr
                                key={emp.id}
                                onClick={() => onRowClick(emp)}
                                className="hover:bg-muted/30 transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {emp.employee.avatar ? (
                                                <img src={emp.employee.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                emp.employee.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{emp.employee.name}</p>
                                            <p className="text-xs text-muted-foreground">{emp.employee.designation}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="font-bold">{emp.presentDays + emp.leaveDays}</span>
                                        <span className="text-[10px] text-muted-foreground">Top: {30 - (emp.presentDays + emp.leaveDays)} LOP</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {formatCurrency(emp.earnings)}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-red-600">
                                    {formatCurrency(emp.deductions)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-foreground">
                                    {formatCurrency(emp.netPay)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {emp.status === "Ready" ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <CheckCircle className="h-3 w-3" /> Ready
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                            <AlertCircle className="h-3 w-3" /> Issue
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {employees.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                    <p>No payroll data found for this month.</p>
                </div>
            )}
        </div>
    );
};

export default PayrollTable;
