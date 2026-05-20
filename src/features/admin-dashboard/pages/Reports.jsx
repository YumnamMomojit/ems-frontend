import React from "react";
import ReportsLayout from "~/components/layout/ReportsLayout";

const AdminReports = () => {
    const navigationItems = [
        { label: "Projects", path: "/admin/reports/projects" },
        { label: "Attendance", path: "/admin/reports/attendance" },
        { label: "Worksheets", path: "/admin/reports/worksheets" },
        { label: "Leaves", path: "/admin/reports/leaves" },
        { label: "Payroll", path: "/admin/reports/payroll" },
        { label: "Documents", path: "/admin/reports/documents" },
    ];

    return <ReportsLayout navigationItems={navigationItems} />;
};

export default AdminReports;
