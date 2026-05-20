import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Reports = () => {
  return (
    <div className="bg-background dark:bg-background text-foreground dark:text-foreground min-h-screen flex flex-col font-display animate-in fade-in duration-500">
      {/* Header */}
      <header className="min-h-16 border-b border-border px-4 md:px-8 py-3 flex items-center justify-between gap-3 flex-wrap bg-background/50 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold">HR Portal</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative group">
            <button className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all">
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span className="hidden sm:inline">Export</span>
              <span className="material-symbols-outlined text-[18px]">
                expand_more
              </span>
            </button>
            {/* Mock Dropdown */}
            <div className="hidden group-hover:block absolute right-0 mt-0 w-48 bg-card dark:bg-card border border-border rounded-lg shadow-xl py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-muted">
                Excel (.xlsx)
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-muted">
                CSV (.csv)
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-muted">
                PDF (.pdf)
              </button>
            </div>
          </div>
          <button className="size-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Global Filter Bar */}
      <div className="px-4 md:px-8 py-4 bg-card dark:bg-card border-b border-border grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
            Date Range
          </label>
          <div className="relative">
            <input
              className="w-full bg-background shadow-md rounded-lg text-sm focus:shadow-lg focus:outline-none py-2 px-3 pl-10 text-foreground transition-shadow"
              type="text"
              defaultValue="Oct 01, 2023 - Oct 31, 2023"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-muted-foreground text-[18px]">
              calendar_month
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
            Department
          </label>
          <select className="w-full bg-background shadow-md rounded-lg text-sm focus:shadow-lg focus:outline-none py-2 px-3 text-foreground transition-shadow">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
            Manager
          </label>
          <select className="w-full bg-background shadow-md rounded-lg text-sm focus:shadow-lg focus:outline-none py-2 px-3 text-foreground transition-shadow">
            <option>All Managers</option>
            <option>Michael Scott</option>
            <option>Jim Halpert</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
            Employee
          </label>
          <div className="relative">
            <input
              className="w-full bg-background shadow-md rounded-lg text-sm focus:shadow-lg focus:outline-none py-2 px-3 pl-10 text-foreground transition-shadow"
              placeholder="Search employee..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-muted-foreground text-[18px]">
              search
            </span>
          </div>
        </div>
        <div className="flex items-end">
          <button className="w-full bg-muted text-foreground py-2 rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 md:px-8 bg-card dark:bg-card border-b border-border overflow-x-auto whitespace-nowrap custom-scrollbar">
        <div className="flex gap-8">
          {/* Using relative paths or full nested paths. Here nesting is under /hr/reports, so 'attendance' works if relative, but full path is safer to avoid confusion */}
          <NavLink
            to="/hr/reports/overview"
            end
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Overview
          </NavLink>
          <NavLink
            to="/hr/reports/attendance"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Attendance
          </NavLink>
          <NavLink
            to="/hr/reports/worksheets"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Worksheets
          </NavLink>
          <NavLink
            to="/hr/reports/leaves"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Leave
          </NavLink>
          <NavLink
            to="/hr/reports/payroll"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Payroll
          </NavLink>
          <NavLink
            to="/hr/reports/documents"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Documents
          </NavLink>
          <NavLink
            to="/hr/reports/reimbursements"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Reimbursements
          </NavLink>
          <NavLink
            to="/hr/reports/advances"
            className={({ isActive }) =>
              `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
            }>
            Advances
          </NavLink>
        </div>
      </div>

      {/* Dashboard Content Container */}
      <div className="flex-1 w-full overflow-hidden">
        <Outlet />
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                   background: #482325;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ec131e;
                }
            `}</style>
    </div>
  );
};

export default Reports;
