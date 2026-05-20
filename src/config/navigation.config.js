/**
 * Navigation Configuration for All Dashboard Roles
 * Defines navigation items, branding, and search settings for each role
 */

// HR Navigation
export const hrNavigation = [
    { name: "Dashboard", href: "/hr/dashboard", icon: "dashboard" },
    { name: "Employees", href: "/hr/employees", icon: "groups" },
    { name: "Attendance", href: "/hr/attendance", icon: "schedule" },
    { name: "Leaves", href: "/hr/leaves", icon: "event_busy" },
    { name: "Worksheets", href: "/hr/worksheets", icon: "assignment" },
    { name: "Payroll", href: "/hr/payroll", icon: "payments" },
    { name: "Projects", href: "/hr/projects", icon: "folder_special" },
    { name: "Reports", href: "/hr/reports", icon: "analytics" },
    { name: "Settings", href: "/hr/settings", icon: "settings" },
];

export const hrBranding = {
    title: "HR Portal",
    icon: "hub"
};

export const hrConfig = {
    navigation: hrNavigation,
    branding: hrBranding,
    showSearch: true,
    searchPlaceholder: "Search employees..."
};

// Admin Navigation
export const adminNavigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Employees", href: "/admin/employees", icon: "groups" },
    { name: "Departments", href: "/admin/departments", icon: "business" },
    { name: "Reports", href: "/admin/reports", icon: "analytics" },
    { name: "Policies", href: "/admin/policies", icon: "policy" },
    { name: "Permissions", href: "/admin/permissions", icon: "security" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
];

export const adminBranding = {
    title: "Admin Portal",
    icon: "admin_panel_settings"
};

export const adminConfig = {
    navigation: adminNavigation,
    branding: adminBranding,
    showSearch: false,
    searchPlaceholder: ""
};

// Manager Navigation
export const managerNavigation = [
    { name: "Dashboard", href: "/manager/dashboard", icon: "dashboard" },
    { name: "Team", href: "/manager/attendance", icon: "groups" },
    { name: "Worksheets", href: "/manager/worksheets", icon: "assignment" },
    { name: "Leaves", href: "/manager/leaves", icon: "event_busy" },
    { name: "Expenses", href: "/manager/reimbursements", icon: "receipt_long" },
    { name: "Advances", href: "/manager/advances", icon: "payments" },
    { name: "Performance", href: "/manager/performance", icon: "trending_up" },
    { name: "Documents", href: "/manager/documents", icon: "description" },
    { name: "Projects", href: "/manager/projects", icon: "folder_special" },
    { name: "Reports", href: "/manager/reports", icon: "analytics" },
    { name: "Settings", href: "/manager/settings", icon: "settings" },
];

export const managerBranding = {
    title: "Manager Portal",
    icon: "supervisor_account"
};

export const managerConfig = {
    navigation: managerNavigation,
    branding: managerBranding,
    showSearch: false,
    searchPlaceholder: ""
};

// Employee Navigation
export const employeeNavigation = [
    { name: "Dashboard", href: "/employee/dashboard", icon: "dashboard" },
    { name: "Attendance", href: "/employee/attendance", icon: "schedule" },
    { name: "Leaves", href: "/employee/leaves", icon: "event_busy" },
    { name: "Worksheets", href: "/employee/worksheets", icon: "assignment" },
    { name: "Expenses", href: "/employee/expenses", icon: "receipt_long" },
    { name: "Salary", href: "/employee/salary", icon: "payments" },
    { name: "Documents", href: "/employee/documents", icon: "description" },
    { name: "Projects", href: "/employee/projects", icon: "folder_special" },

    { name: "Settings", href: "/employee/settings", icon: "settings" },
];

export const employeeBranding = {
    title: "Employee Portal",
    icon: "badge"
};

export const employeeConfig = {
    navigation: employeeNavigation,
    branding: employeeBranding,
    showSearch: false,
    searchPlaceholder: ""
};
