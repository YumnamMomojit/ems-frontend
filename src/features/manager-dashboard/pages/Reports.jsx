import React from "react";
import ReportsLayout from "~/components/layout/ReportsLayout";

const ManagerReports = () => {
    const navigationItems = [
        { label: "Overview", path: "/manager/reports/overview" },
        { label: "Team Attendance", path: "/manager/reports/attendance" },
        { label: "Leave Requests", path: "/manager/reports/leaves" },
        { label: "Expenses", path: "/manager/reports/expenses" },
        { label: "Advances", path: "/manager/reports/advances" },
    ];

    return <ReportsLayout navigationItems={navigationItems} />;
};

export default ManagerReports;
