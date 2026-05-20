import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import DashboardSearch from "./DashboardSearch";
import DashboardUserMenu from "./DashboardUserMenu";
import DashboardNotifications from "./DashboardNotifications";

/**
 * DashboardHeader Component
 * Shared header with navigation, search, notifications, theme toggle, and user menu
 *
 * @param {Array} navigation - Navigation items array [{ name, href, icon }]
 * @param {Object} branding - Branding config { title, icon }
 * @param {boolean} showSearch - Whether to show search bar
 * @param {string} searchPlaceholder - Search placeholder text
 * @param {function} onSearch - Search handler function
 * @param {boolean} isScrolled - Whether navbar is scrolled
 * @param {function} onLogoutClick - Logout button click handler
 */
const DashboardHeader = ({
  navigation = [],
  branding = { title: "Dashboard", icon: "hub" },
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  isScrolled = false,
  onLogoutClick,
  onMobileMenuToggle,
}) => {
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "bg-gray-900 dark:bg-gray-900 border-gray-800"
          : "bg-card dark:bg-card border-border"
      } shadow-sm`}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between py-3 md:py-4 px-3 md:px-6 gap-3">
        {/* Left: Branding + Navigation */}
        <div className="flex items-center gap-3 md:gap-10 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className={`lg:hidden inline-flex items-center justify-center size-9 rounded-md transition-colors ${
              isScrolled
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-muted"
            }`}
            aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div
            className={`flex items-center gap-2 md:gap-3 min-w-0 ${isScrolled ? "text-white" : "text-foreground dark:text-foreground"}`}>
            <img 
              src="/jws-logo.png" 
              alt="JWS Logo" 
              className="h-8 md:h-10 w-auto object-contain" 
            />
            <h2 className="text-base md:text-xl font-bold leading-tight tracking-tight truncate max-w-[42vw] md:max-w-none">
              {branding.title}
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isScrolled
                      ? isActive
                        ? "text-white border-b-2 border-white pb-0.5"
                        : "text-gray-300 hover:text-white"
                      : isActive
                        ? "text-primary border-b-2 border-primary pb-0.5"
                        : "text-foreground hover:text-primary"
                  }`
                }>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          {/* Search Bar */}
          {showSearch && (
            <DashboardSearch
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              isScrolled={isScrolled}
            />
          )}

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                className={`relative p-1 rounded-full transition-colors ${
                  isScrolled
                    ? "text-white hover:text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary border-2 border-card"></span>
              </button>
              {isNotificationOpen && (
                <DashboardNotifications
                  onClose={() => setIsNotificationOpen(false)}
                />
              )}
            </div>

            {/* User Menu */}
            <DashboardUserMenu showRole={false} isScrolled={isScrolled} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
