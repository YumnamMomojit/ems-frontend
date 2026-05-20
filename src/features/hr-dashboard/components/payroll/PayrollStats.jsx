import React from "react";
import { Users, Calendar, Banknote, CreditCard } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const PayrollStats = ({ stats, loading }) => {
    const { currencySymbol } = useOrganization();
    
    const formatCurrency = (amount) => {
        return `${currencySymbol}${(amount || 0).toLocaleString()}`;
    };

    const items = [
        {
            label: "Total Employees",
            value: stats?.totalEmployees || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            label: "Avg Paid Days",
            value: stats?.avgPaidDays || 0,
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            label: "Total Deductions",
            value: formatCurrency(stats?.totalDeductions || 0),
            icon: CreditCard,
            color: "text-red-600",
            bg: "bg-red-100"
        },
        {
            label: "Net Payable",
            value: formatCurrency(stats?.netPayable || 0),
            icon: Banknote,
            color: "text-green-600",
            bg: "bg-green-100"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <div key={index} className="bg-card border rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-lg ${item.bg}`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                        <h3 className="text-xl font-bold text-foreground">{item.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PayrollStats;
