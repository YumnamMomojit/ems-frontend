import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import { useIsMobile } from "~/hooks/use-mobile"; // Import the hook
import {
  Home,
  Users,
  Clock,
  ClipboardCheck,
  DollarSign,
  FileText,
  Briefcase,
  HandCoins,
  LogOut,
  User,
  Settings,
  Calendar,
  Megaphone,
  Mail,
  Award,
  Activity,
  Menu,
  X,
  Building,
  Folder,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle"; // Assuming this component exists

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile(); // Use the hook

  if (!user) {
    return null;
  }

  const isAdmin =
    user.role.toUpperCase() === "ADMIN" ||
    user.role.toUpperCase() === "SUPER_ADMIN" ||
    user.role.toUpperCase() === "ORG_ADMIN";
  const isHR = user.role.toUpperCase() === "HR";
  const isManager = user.role.toUpperCase() === "MANAGER";
  const isEmployee = user.role.toUpperCase() === "EMPLOYEE";

  const adminNavigation = [
    // Main Dashboard
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    // Users & Organization
    {
      name: "Employees",
      href: "/admin/employees",
      icon: Users,
    },
    {
      name: "Departments",
      href: "/admin/departments",
      icon: Building,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: Folder,
    },
    // Operations
    {
      name: "Attendance",
      href: "/admin/attendance",
      icon: Clock,
    },
    {
      name: "Worksheet",
      href: "/admin/worksheet",
      icon: ClipboardCheck,
    },
    {
      name: "Leave",
      href: "/admin/leaves",
      icon: Briefcase,
    },
    {
      name: "Payroll",
      href: "/admin/payroll",
      icon: DollarSign,
    },
    {
      name: "Documents",
      href: "/admin/documents",
      icon: FileText,
    },
    // Settings & Policies
    {
      name: "Policies",
      href: "/admin/policies",
      icon: Settings,
    },
    // User Profile
    {
      name: "Profile",
      href: "/admin/profile",
      icon: User,
    },
  ];

  const hrNavigation = [
    {
      name: "Dashboard",
      href: "/hr/dashboard",
      icon: Home,
    },
    {
      name: "Employees",
      href: "/hr/employees",
      icon: Users,
    },
    {
      name: "Attendance",
      href: "/hr/attendance",
      icon: Clock,
    },
    {
      name: "Worksheets",
      href: "/hr/worksheets",
      icon: ClipboardCheck,
    },
    {
      name: "Leave Management",
      href: "/hr/leaves",
      icon: Briefcase,
    },
    {
      name: "Reimbursements",
      href: "/hr/reimbursements",
      icon: DollarSign,
    },
    {
      name: "Advances",
      href: "/hr/advances",
      icon: HandCoins,
    },
    {
      name: "Salary Slips",
      href: "/hr/salary-slips",
      icon: FileText,
    },
    {
      name: "Documents",
      href: "/hr/documents",
      icon: Folder,
    },
  ];


  const managerNavigation = [
    {
      name: "Dashboard",
      href: "/manager/dashboard",
      icon: Home,
    },
    {
      name: "Team Attendance",
      href: "/manager/attendance",
      icon: Clock,
    },
    {
      name: "Worksheet Review",
      href: "/manager/worksheets",
      icon: ClipboardCheck,
    },
    {
      name: "Leave Approvals",
      href: "/manager/leaves",
      icon: Briefcase,
    },
    {
      name: "Reimbursements",
      href: "/manager/reimbursements",
      icon: DollarSign,
    },
    {
      name: "Advance Requests",
      href: "/manager/advances",
      icon: HandCoins,
    },
    {
      name: "Team Performance",
      href: "/manager/performance",
      icon: TrendingUp,
    },
    {
      name: "Team Documents",
      href: "/manager/documents",
      icon: FileText,
    },
    {
      name: "My Profile",
      href: "/manager/profile",
      icon: User,
    },
  ];

  const employeeNavigation = [
    {
      name: "Dashboard",
      href: "/employee/dashboard",
      icon: Home,
    },
    {
      name: "Employee Directory",
      href: "/employee/directory",
      icon: Users,
    },
    {
      name: "Employee Attendance",
      href: "/employee/attendance",
      icon: Clock,
    },
    {
      name: "Employee Leave",
      href: "/employee/leave",
      icon: Briefcase,
    },
    {
      name: "Expenses",
      href: "/employee/expenses",
      icon: DollarSign,
    },
    {
      name: "Documents",
      href: "/employee/documents",
      icon: FileText,
    },
    {
      name: "Advance",
      href: "/employee/advance",
      icon: HandCoins,
    },
    {
      name: "My Worksheets",
      href: "/employee/my-worksheets",
      icon: ClipboardCheck,
    },
    {
      name: "Employee Payroll",
      href: "/employee/payroll",
      icon: DollarSign,
    },
    {
      name: "My Profile",
      href: "/employee/profile",
      icon: User,
    },
    {
      name: "Employee Settings",
      href: "/employee/settings",
      icon: Settings,
    },
  ];

  const navigation = isAdmin
    ? adminNavigation
    : isHR
      ? hrNavigation
      : isManager
        ? managerNavigation
        : isEmployee
          ? employeeNavigation
          : [];

  const sidebarClass = isAdmin
    ? "hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-border"
    : "hidden md:flex flex-col w-64 bg-darkRed-dark text-white";

  const headerClass = isAdmin
    ? "flex items-center justify-between h-16 bg-sidebar/90 backdrop-blur-md border-b border-border px-6"
    : "flex items-center justify-between h-16 bg-darkRed border-b border-orange px-6";

  const navLinkClass = ({ isActive }) => {
    if (isAdmin) {
      return `flex items-center px-4 py-2 my-1 mx-2 rounded-lg transition-all duration-200 ${isActive
        ? "bg-primary text-primary-foreground shadow-lg shadow-jws-red-glow"
        : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
        } font-medium`;
    }
    return `flex items-center px-4 py-2 text-orange rounded-md hover:bg-darkRed-dark hover:text-white ${isActive ? "bg-darkRed text-white" : ""
      } font-normal`;
  };

  const mobileSidebarClass = isAdmin
    ? `fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out border-r border-border ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
    : `fixed inset-y-0 left-0 z-50 w-64 bg-darkRed-dark text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`;


  return (
    <div className="flex h-screen bg-background text-foreground">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className={sidebarClass}>
          <div className={`flex items-center justify-center h-16 text-xl font-bold tracking-wider ${isAdmin ? 'bg-sidebar text-primary border-b border-border' : 'bg-darkRed'}`}>
            EMS
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navLinkClass}>
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className={`p-4 border-t items-center ${isAdmin ? 'border-border' : 'border-orange'}`}>
            <div className={`text-sm mb-2 font-normal ${isAdmin ? 'text-muted-foreground' : 'text-orange-light'}`}>
              {user.name} ({user.role})
            </div>

            <button
              onClick={logout}
              className={`flex items-center w-full px-4 py-2 rounded-md font-normal transition-colors ${isAdmin ? 'text-muted-foreground hover:bg-muted hover:text-primary' : 'text-orange-light hover:bg-orange hover:text-white'}`}>
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Mobile */}
      {isMobile && (
        <div className={mobileSidebarClass}>
          <div className={`flex items-center justify-between h-16 text-xl font-medium px-4 ${isAdmin ? 'bg-sidebar text-primary border-b border-border' : 'bg-darkRed'}`}>
            EMS
            <button onClick={() => setIsSidebarOpen(false)}>
              <X className={`h-6 w-6 ${isAdmin ? 'text-muted-foreground' : 'text-white'}`} />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navLinkClass}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on nav item click
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className={`p-4 border-t flex flex-col space-y-4 ${isAdmin ? 'border-border' : 'border-orange'}`}>
            <div className={`text-sm font-normal ${isAdmin ? 'text-muted-foreground' : 'text-orange-light'}`}>
              {user.name} ({user.role})
            </div>
            <div className="flex justify-between items-center w-full">
              <ThemeToggle />
              <button
                onClick={logout}
                className={`flex items-center px-4 py-2 rounded-md font-normal ${isAdmin ? 'text-muted-foreground hover:text-primary' : 'text-orange hover:bg-orange hover:text-white'}`}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={headerClass}>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu className={`h-6 w-6 ${isAdmin ? 'text-muted-foreground' : 'text-white'}`} />
            </button>
          )}
          <div className="flex items-center">
            <h1 className={`text-xl font-bold tracking-tight ${isAdmin ? 'text-foreground' : 'text-white'}`}>
              {navigation.find((item) => item.href === window.location.pathname)
                ?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isMobile && <ThemeToggle />}
          </div>
        </header>
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isAdmin ? 'bg-background text-foreground' : 'bg-background text-foreground'}`}>
          <Outlet />
        </main>
      </div>

    </div>
  );
};


export default MainLayout;
