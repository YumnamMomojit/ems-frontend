import React from "react";
import { Users, UserCheck, UserX, Clock, ClipboardList, Briefcase, DollarSign, HandCoins } from "lucide-react";
import KpiCard from "~/features/admin-dashboard/components/cards/KpiCard";

const OverviewCards = ({ summary }) => {
    if (!summary) return null;

    const cards = [
        {
            title: "Total Team",
            value: summary.totalTeam,
            icon: Users,
            description: "Allocated employees",
        },
        {
            title: "Present Today",
            value: summary.presentToday,
            icon: UserCheck,
            description: "Checked-in members",
        },
        {
            title: "Absent Today",
            value: summary.absentToday,
            icon: UserX,
            description: "Not checked-in",
        },
        {
            title: "Pending Worksheets",
            value: summary.pendingWorksheets,
            icon: ClipboardList,
            description: "Awaiting approval",
        },
        {
            title: "Pending Leaves",
            value: summary.pendingLeaves,
            icon: Briefcase,
            description: "Awaiting evaluation",
        },
        {
            title: "Pending Reimbursements",
            value: summary.pendingExpenses,
            icon: DollarSign,
            description: "Verify bills",
        },
        {
            title: "Pending Advances",
            value: summary.pendingAdvances,
            icon: HandCoins,
            description: "Evaluate needs",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <KpiCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    description={card.description}
                />
            ))}
        </div>
    );
};

export default OverviewCards;
