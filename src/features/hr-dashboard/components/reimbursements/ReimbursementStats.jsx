import React from "react";
import { Receipt, CheckCircle, Clock } from "lucide-react";

const ReimbursementStats = ({ stats }) => {
    const cards = [
        {
            title: "Pending Requests",
            value: stats?.pending || 0,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-200",
        },
        {
            title: "Approved (Unpaid)",
            value: stats?.approvedUnpaid || 0,
            icon: CheckCircle,
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-200",
        },
        {
            title: "Paid This Month",
            value: stats?.paidThisMonth || 0,
            icon: Receipt,
            color: "text-green-600",
            bg: "bg-green-50 border-green-200",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${card.bg} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                            <h3 className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-full bg-white/50 ${card.color}`}>
                            <card.icon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReimbursementStats;
