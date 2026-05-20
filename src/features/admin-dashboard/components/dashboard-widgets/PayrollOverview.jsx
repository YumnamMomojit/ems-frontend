import React from "react";
import { DollarSign, PieChart, TrendingUp, CreditCard } from "lucide-react";
import { useOrganization } from "../../../../hooks/OrganizationContext";

const PayrollOverview = ({ finance, payroll }) => {
    const { currencySymbol } = useOrganization();
    if (!finance) return null;

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-card-foreground flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    Financial Overview
                </h3>
                <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded">This Month</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Reimbursed */}
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Reimbursed</span>
                    </div>
                    <p className="text-xl font-bold text-card-foreground">{currencySymbol}{finance.reimbursedTotal.toLocaleString()}</p>
                </div>

                {/* Advances */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Advances</span>
                    </div>
                    <p className="text-xl font-bold text-card-foreground">{currencySymbol}{finance.advancesTotal.toLocaleString()}</p>
                </div>

                {/* Pending Liability */}
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Pending Financials</span>
                        </div>
                        <span className="text-xs text-orange-600 font-medium">Claims & Advances</span>
                    </div>
                    <p className="text-xl font-bold text-card-foreground">{currencySymbol}{finance.pendingAmount.toLocaleString()}</p>
                </div>

                {/* Payroll Liability */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Est. Payroll Liability</span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">Active Salaries</span>
                    </div>
                    <p className="text-xl font-bold text-card-foreground">{currencySymbol}{payroll.totalLiability.toLocaleString()}</p>
                </div>

            </div>
        </div>
    );
};

export default PayrollOverview;
