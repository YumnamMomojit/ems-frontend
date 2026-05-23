import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeSalary } from "~/services/employee.api"; // API function exists
import { Download, DollarSign, Calendar, TrendingUp, TrendingDown, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useOrganization } from "~/hooks/OrganizationContext";

const Salary = () => {
    const { currencySymbol } = useOrganization();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [expandedRow, setExpandedRow] = useState(null);
    // const [selectedMonth, setSelectedMonth] = useState(null); // For detail view if needed

    const { data: salaryData, isLoading, isError } = useQuery({
        queryKey: ["employeeSalary", selectedYear],
        queryFn: () => getEmployeeSalary(selectedYear),
    });

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "text-green-600 bg-green-50 dark:bg-green-900/10";
            case "PENDING": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10";
            case "FAILED": return "text-red-600 bg-red-50 dark:bg-red-900/10";
            default: return "text-gray-600 bg-gray-50 dark:bg-gray-800";
        }
    };

    if (isLoading) return <div className="p-6">Loading salary information...</div>;
    if (isError) return <div className="p-6">Error loading salary data.</div>;

    // Calculate totals for the year
    const totalEarnings = salaryData?.reduce((acc, curr) => acc + (curr.netPay || 0), 0) || 0;
    const totalDeductions = salaryData?.reduce((acc, curr) => acc + (curr.deductions || 0), 0) || 0;
    const latestSalary = salaryData && salaryData.length > 0 ? salaryData[0] : null;

    const handleDownloadPayslip = (url) => {
        if (!url) {
            toast.error("Payslip not available");
            return;
        }
        window.open(url, "_blank");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Salary & Payroll</h1>
                    <p className="text-muted-foreground">View your payslips and salary history</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="pl-3 pr-8 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Total Net Pay ({selectedYear})</p>
                    <h3 className="text-2xl font-bold text-foreground mt-2">
                        {currencySymbol}{totalEarnings.toLocaleString()}
                    </h3>
                </div>

                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingDown className="w-16 h-16 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Total Deductions</p>
                    <h3 className="text-2xl font-bold text-foreground mt-2">
                        {currencySymbol}{totalDeductions.toLocaleString()}
                    </h3>
                </div>

                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard className="w-16 h-16 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Latest Salary Status</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${latestSalary ? getStatusColor(latestSalary.status) : 'bg-muted text-muted-foreground'}`}>
                            {latestSalary ? latestSalary.status : "No Data"}
                        </span>
                        {latestSalary && (
                            <span className="text-sm text-muted-foreground">
                                for {months[latestSalary.month - 1]}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Salary History Table */}
            <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Monthly Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/30 text-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4">Basic Pay</th>
                                <th className="px-6 py-4">Allowances</th>
                                <th className="px-6 py-4">Deductions</th>
                                <th className="px-6 py-4">Net Salary</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Payslip</th>
                                <th className="px-6 py-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {salaryData && salaryData.length > 0 ? (
                                salaryData.map((salary) => (
                                    <React.Fragment key={salary.id}>
                                    <tr className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {months[salary.month - 1]} {salary.year}
                                        </td>
                                        <td className="px-6 py-4">{currencySymbol}{salary.basicPay?.toLocaleString() || salary.earnings?.basicPay?.toLocaleString() || '0'}</td>
                                        <td className="px-6 py-4">{currencySymbol}{((salary.earnings?.hra || 0) + (salary.earnings?.conveyance || 0) + (salary.earnings?.specialAllowance || 0) + (salary.earnings?.overtimePay || 0)).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-red-500">-{currencySymbol}{salary.totalDeductions?.toLocaleString() || salary.deductions?.toLocaleString() || '0'}</td>
                                        <td className="px-6 py-4 font-bold text-foreground">
                                            {currencySymbol}{salary.netPayable?.toLocaleString() || salary.netPay?.toLocaleString() || '0'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(salary.status)}`}>
                                                {salary.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {salary.payslipUrl ? (
                                                <button
                                                    onClick={() => handleDownloadPayslip(salary.payslipUrl)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-lg transition text-xs font-medium"
                                                >
                                                    <Download className="w-3 h-3" /> Download
                                                </button>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">Unavailable</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setExpandedRow(expandedRow === salary.id ? null : salary.id)}
                                                className="p-1 hover:bg-muted rounded transition"
                                            >
                                                {expandedRow === salary.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === salary.id && salary.deductionBreakdown && (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-4 bg-muted/30">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">STATUTORY</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between"><span>PF:</span><span className="font-medium">{currencySymbol}{salary.deductionBreakdown.pf?.toFixed(2)}</span></div>
                                                            <div className="flex justify-between"><span>ESI:</span><span className="font-medium">{currencySymbol}{salary.deductionBreakdown.esi?.toFixed(2)}</span></div>
                                                            <div className="flex justify-between"><span>PT:</span><span className="font-medium">{currencySymbol}{salary.deductionBreakdown.pt?.toFixed(2)}</span></div>
                                                            <div className="flex justify-between"><span>TDS:</span><span className="font-medium">{currencySymbol}{salary.deductionBreakdown.tds?.toFixed(2)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">PENALTIES</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between"><span>Late Days:</span><span className="font-medium">{salary.lateDays || 0}</span></div>
                                                            <div className="flex justify-between"><span>Late Deduction:</span><span className="font-medium text-red-500">-{currencySymbol}{salary.deductionBreakdown.lateDeduction?.toFixed(2)}</span></div>
                                                            <div className="flex justify-between"><span>Leave Deduction:</span><span className="font-medium text-red-500">-{currencySymbol}{salary.deductionBreakdown.leaveDeduction?.toFixed(2)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">LOANS & ADVANCES</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between"><span>Advance:</span><span className="font-medium text-red-500">-{currencySymbol}{salary.deductionBreakdown.advanceDeduction?.toFixed(2)}</span></div>
                                                            <div className="flex justify-between"><span>Loan EMI:</span><span className="font-medium text-red-500">-{currencySymbol}{salary.deductionBreakdown.loanDeduction?.toFixed(2)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">SUMMARY</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between"><span>Working Days:</span><span className="font-medium">{salary.workingDays || 0}</span></div>
                                                            <div className="flex justify-between"><span>Present:</span><span className="font-medium">{salary.presentDays || 0}</span></div>
                                                            <div className="flex justify-between"><span>Late:</span><span className="font-medium">{salary.lateDays || 0}</span></div>
                                                            <div className="flex justify-between font-semibold"><span>Total Deductions:</span><span className="text-red-500">-{currencySymbol}{salary.totalDeductions?.toFixed(2)}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-muted-foreground">
                                        No salary records found for {selectedYear}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Salary;
