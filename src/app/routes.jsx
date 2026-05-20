import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import LoginPage from "~/features/auth/LoginPage";
import RegisterPage from "~/features/auth/RegisterPage";
import AdminDashboard from "~/features/admin-dashboard/pages/Dashboard";
import NotFoundPage from "~/components/common/NotFoundPage";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { useAuth } from "~/hooks/AuthContext";

import { queryClient } from "~/lib/queryClient";
import { ThemeProvider } from "~/lib/theme-provider";

// Navigation configurations for all roles
import {
  hrConfig,
  adminConfig,
  managerConfig,
  employeeConfig,
} from "~/config/navigation.config";

// Admin Dashboard Pages
import AdminProfilePage from "../features/admin-dashboard/pages/AdminProfilePage";
import AdminAdvancePage from "../features/admin-dashboard/pages/AdminAdvancePage";
import AdminAttendancePage from "../features/admin-dashboard/pages/AdminAttendancePage";
import AdminDocumentsPage from "../features/admin-dashboard/pages/AdminDocumentsPage";
import AdminLeavePage from "../features/admin-dashboard/pages/AdminLeavePage";
import AdminPayrollPage from "../features/admin-dashboard/pages/AdminPayrollPage";
import AdminWorksheetPage from "../features/admin-dashboard/pages/AdminWorksheetPage";
import AdminAddEmployeePage from "../features/admin-dashboard/pages/AddEmployeePage";
import AdminAddDepartmentPage from "~/features/admin-dashboard/pages/AddDepartmentPage";
import EmployeeListPage from "~/features/admin-dashboard/pages/EmployeeListPage";
import DepartmentListPage from "~/features/admin-dashboard/pages/DepartmentListPage";
import ProjectManagementPage from "~/features/admin-dashboard/pages/ProjectManagementPage";
import PoliciesPage from "~/features/admin-dashboard/pages/PoliciesPage";
import AdminEmployeeProfilePage from "~/features/admin-dashboard/pages/EmployeeProfile";
import AdminPermissionsPage from "~/features/admin-dashboard/pages/AdminPermissionsPage";

// HR Dashboard Pages
import { HRRoutes } from "~/features/hr-dashboard";

// Manager Dashboard Pages
import ManagerDashboard from "~/features/manager-dashboard/pages/ManagerDashboard";
import TeamAttendance from "~/features/manager-dashboard/pages/TeamAttendance";
import WorksheetReview from "~/features/manager-dashboard/pages/WorksheetReview";
import LeaveApprovals from "~/features/manager-dashboard/pages/LeaveApprovals";
import Reimbursements from "~/features/manager-dashboard/pages/Reimbursements";
import AdvanceRequests from "~/features/manager-dashboard/pages/AdvanceRequests";
import TeamPerformance from "~/features/manager-dashboard/pages/TeamPerformance";
import TeamDocuments from "~/features/manager-dashboard/pages/TeamDocuments";

// Employee Dashboard Pages
import EmployeeDashboard from "~/features/employee-dashboard/pages/dashboard";
import EmployeeDirectory from "~/features/employee-dashboard/pages/directory";
import EmployeeAttendance from "~/features/employee-dashboard/pages/attendance";
import EmployeeLeaves from "~/features/employee-dashboard/pages/Leaves";
import EmployeeDocuments from "~/features/employee-dashboard/pages/Documents";
import EmployeeProfile from "~/features/employee-dashboard/pages/profile";

import EmployeeSalary from "~/features/employee-dashboard/pages/Salary";
import EmployeeSettings from "~/features/employee-dashboard/pages/settings";
import EmployeeCalendarPage from "~/features/employee-dashboard/pages/calendar";
import EmployeeAnnouncements from "~/features/employee-dashboard/pages/announcements";
import EmployeeMailbox from "~/features/employee-dashboard/pages/mailbox";
import EmployeeAchievements from "~/features/employee-dashboard/pages/achievements";
import EmployeePerformance from "~/features/employee-dashboard/pages/performance";
import EmployeeWorksheets from "~/features/employee-dashboard/pages/Worksheets";
import EmployeeExpenses from "~/features/employee-dashboard/pages/Expenses";

// Reports and Settings Components
import SharedSettings from "~/components/layout/SharedSettings";
import AdminReports from "~/features/admin-dashboard/pages/Reports";
import ManagerReports from "~/features/manager-dashboard/pages/Reports";

// ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toUpperCase() : "";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (
      userRole === "ADMIN" ||
      userRole === "SUPER_ADMIN" ||
      userRole === "ORG_ADMIN"
    ) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "HR") {
      return <Navigate to="/hr/dashboard" replace />;
    } else if (userRole === "MANAGER") {
      return <Navigate to="/manager/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return children;
};

// DashboardRedirect component - redirects unknown routes to user's dashboard
const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toUpperCase() : "";

  if (userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userRole === "ORG_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === "HR") {
    return <Navigate to="/hr/dashboard" replace />;
  } else if (userRole === "MANAGER") {
    return <Navigate to="/manager/dashboard" replace />;
  } else {
    return <Navigate to="/employee/dashboard" replace />;
  }
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root Redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? (() => {
                        const role = user.role?.toUpperCase();
                        if (
                          role === "ADMIN" ||
                          role === "SUPER_ADMIN" ||
                          role === "ORG_ADMIN"
                        )
                          return "/admin/dashboard";
                        if (role === "HR") return "/hr/dashboard";
                        if (role === "MANAGER") return "/manager/dashboard";
                        return "/employee/dashboard";
                      })()
                    : "/login"
                }
                replace
              />
            }
          />

          {/* Protected Routes for HR - Using New DashboardLayout */}
          <Route element={<DashboardLayout {...hrConfig} />}>
            <Route
              path="/hr/*"
              element={
                <ProtectedRoute
                  allowedRoles={["HR", "ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <HRRoutes />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected Routes for Admin - Using New DashboardLayout */}
          <Route element={<DashboardLayout {...adminConfig} />}>
            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* ... other admin routes ... */}
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <SharedSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminReports />
                </ProtectedRoute>
              }>
              <Route path="projects" element={<ProjectManagementPage />} />
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="worksheets" element={<AdminWorksheetPage />} />
              <Route path="leaves" element={<AdminLeavePage />} />
              <Route path="payroll" element={<AdminPayrollPage />} />
              <Route path="documents" element={<AdminDocumentsPage />} />
              <Route index element={<Navigate to="projects" replace />} />
            </Route>

            {/* Admin Miscellaneous */}
            <Route
              path="/employee/advance"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <AdminAdvancePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/employees/add"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminAddEmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments/add"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminAddDepartmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminProfilePage />
                </ProtectedRoute>
              }
            />
            {/* New Admin Pages - User & Organization */}
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <EmployeeListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminEmployeeProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <DepartmentListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/policies"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <PoliciesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/permissions"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "ORG_ADMIN"]}>
                  <AdminPermissionsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected Routes for Manager - Using New DashboardLayout */}
          <Route element={<DashboardLayout {...managerConfig} />}>
            {/* Manager */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/settings"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <SharedSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/reports"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <ManagerReports />
                </ProtectedRoute>
              }>
              <Route
                path="overview"
                element={<div>Manager Overview Report Placeholder</div>}
              />
              <Route
                path="attendance"
                element={<div>Team Attendance Report Placeholder</div>}
              />
              <Route
                path="leaves"
                element={<div>Leave Requests Report Placeholder</div>}
              />
              <Route
                path="expenses"
                element={<div>Expenses Report Placeholder</div>}
              />
              <Route
                path="advances"
                element={<div>Advances Report Placeholder</div>}
              />
              <Route index element={<Navigate to="overview" replace />} />
            </Route>

            <Route
              path="/manager/attendance"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <TeamAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/worksheets"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <WorksheetReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/leaves"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <LeaveApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/reimbursements"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <Reimbursements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/advances"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <AdvanceRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/performance"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <TeamPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/documents"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <TeamDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/projects"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <ProjectManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manager/profile"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "ORG_ADMIN",
                  ]}>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected Routes for Employee - Using New DashboardLayout */}
          <Route element={<DashboardLayout {...employeeConfig} />}>
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee/directory"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/attendance"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeAttendance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee/settings"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <SharedSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/calendar"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/announcements"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/mailbox"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeMailbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/achievements"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeAchievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/performance"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeePerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/leaves"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/worksheets"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeWorksheets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/expenses"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeExpenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/salary"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeSalary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/documents"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <EmployeeDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/projects"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "EMPLOYEE",
                    "MANAGER",
                    "ADMIN",
                    "SUPER_ADMIN",
                    "HR",
                  ]}>
                  <ProjectManagementPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 - Redirect to dashboard based on role */}
          <Route path="*" element={<DashboardRedirect />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppRoutes;
