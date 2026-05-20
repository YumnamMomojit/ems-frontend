import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";

/**
 * Shared layout for Reports pages across different roles
 * Provides header, filters, and role-specific tab navigation
 * @param {Object} navigationItems - Array of objects { label: string, path: string } for tabs
 */
const ReportsLayout = ({ navigationItems }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="bg-background dark:bg-background text-foreground dark:text-foreground min-h-screen flex flex-col font-display animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <header className="min-h-16 border-b border-border px-4 md:px-8 py-3 flex items-center justify-between gap-3 flex-wrap bg-background/50 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold">Reports & Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
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
        </div>
      </header>

      {/* Global Filter Bar - Simplified for generic use */}
      {user?.role === "HR" ||
      user?.role === "ADMIN" ||
      user?.role === "MANAGER" ? (
        <div className="px-4 md:px-8 py-4 bg-card dark:bg-card border-b border-border grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              Date Range
            </label>
            <div className="relative">
              <input
                className="w-full bg-background shadow-md rounded-lg text-sm focus:shadow-lg focus:outline-none py-2 px-3 pl-10 text-foreground transition-shadow"
                type="text"
                defaultValue="Current Month"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-muted-foreground text-[18px]">
                calendar_month
              </span>
            </div>
          </div>
          {/* Role specific filters could be added here later */}
          <div className="flex flex-col gap-1.5 col-span-2">
            {/* Spacer or additional filters */}
          </div>
          <div className="flex items-end">
            <button className="w-full bg-muted text-foreground py-2 rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      ) : null}

      {/* Tab Navigation */}
      <div className="px-4 md:px-8 bg-card dark:bg-card border-b border-border overflow-x-auto whitespace-nowrap custom-scrollbar">
        <div className="flex gap-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `py-4 text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`
              }>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Dashboard Content Container */}
      <div className="flex-1 w-full overflow-hidden p-4 md:p-6">
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

export default ReportsLayout;
