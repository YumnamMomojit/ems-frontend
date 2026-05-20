import React from "react";
import { Users, UserCheck, Clock, FileText, CreditCard, DollarSign } from "lucide-react";

export const AdminStats = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        {
            title: "Total Employees",
            value: stats.employees.total,
            subValue: `${stats.employees.active} Active`,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Today's Attendance",
            value: stats.attendance.present,
            subValue: `${stats.attendance.absent} Absent`,
            icon: Clock,
            color: "bg-green-500",
        },
        {
            title: "Pending Requests",
            value: stats.pending.leaves + stats.pending.reimbursements + stats.pending.advances,
            subValue: `${stats.pending.leaves} Leaves, ${stats.pending.reimbursements} Claims`,
            icon: FileText,
            color: "bg-orange-500",
        },
        {
            title: "Payroll Status",
            value: stats.payroll.status,
            subValue: `Month: ${stats.payroll.month}/${stats.payroll.year}`,
            icon: DollarSign,
            color: stats.payroll.status === 'COMPLETED' ? "bg-teal-500" : "bg-purple-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-card rounded-xl shadow-sm border border-border p-6 flex items-start justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">{card.title}</p>
                        <h3 className="text-2xl font-bold text-card-foreground">{card.value}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{card.subValue}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                        <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
