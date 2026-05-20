import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Attendance from "../pages/Attendance";
import Worksheets from "../pages/Worksheets";
import LeaveManagement from "../pages/LeaveManagement";
import Reimbursements from "../pages/Reimbursements";
import Advances from "../pages/Advances";
import SalarySlips from "../pages/SalarySlips";
import Documents from "../pages/Documents";
import EmployeeDirectory from "../pages/EmployeeDirectory";
import EmployeeProfile from "../pages/EmployeeProfile";
import SettingsLayout from "../pages/settings/SettingsLayout";
import ProfileSettings from "../pages/settings/ProfileSettings";
import NotificationSettings from "../pages/settings/NotificationSettings";
import Reports from "../pages/Reports";
import ReportsOverview from "../pages/ReportsOverview";

import Leaves from "../pages/LeaveManagement";
import PayrollPage from "../pages/PayrollPage";
import ProjectManagementPage from "~/features/admin-dashboard/pages/ProjectManagementPage";

const HRRoutes = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeDirectory />} />
            <Route path="employees/:id" element={<EmployeeProfile />} />
            
            {/* Direct page routes for navigation */}
            <Route path="attendance" element={<Attendance />} />
            <Route path="worksheets" element={<Worksheets />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="reimbursements" element={<Reimbursements />} />
            <Route path="advances" element={<Advances />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="documents" element={<Documents />} />
            <Route path="projects" element={<ProjectManagementPage />} />

            <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="notifications" element={<NotificationSettings />} />
            </Route>

            <Route path="reports" element={<Reports />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<ReportsOverview />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="worksheets" element={<Worksheets />} />
                <Route path="leaves" element={<Leaves />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="reimbursements" element={<Reimbursements />} />
                <Route path="advances" element={<Advances />} />
                <Route path="documents" element={<Documents />} />
            </Route>
            <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
        </Routes>
    );
};

export default HRRoutes;
