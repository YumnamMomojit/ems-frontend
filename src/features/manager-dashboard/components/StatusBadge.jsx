import React from "react";

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        APPROVED: "bg-green-100 text-green-800 border-green-200",
        REJECTED: "bg-red-100 text-red-800 border-red-200",
        PAID: "bg-blue-100 text-blue-800 border-blue-200",
        PRESENT: "bg-green-100 text-green-800 border-green-200",
        ABSENT: "bg-red-100 text-red-800 border-red-200",
        LATE: "bg-orange-100 text-orange-800 border-orange-200",
        PUNCHED_IN: "bg-emerald-100 text-emerald-800 border-emerald-200",
        PUNCHED_OUT: "bg-slate-100 text-slate-800 border-slate-200",
    };

    const normalizedStatus = status?.toUpperCase() || "PENDING";
    const styleClass = styles[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass}`}>
            {normalizedStatus}
        </span>
    );
};

export default StatusBadge;
