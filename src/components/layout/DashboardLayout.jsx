import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import DashboardHeader from "./DashboardHeader";

/**
 * DashboardLayout Component
 * Reusable layout component for all dashboards (HR, Admin, Manager, Employee)
 * Provides consistent UI/UX with top navbar, identical to HR Dashboard design
 *
 * @param {Array} navigation - Navigation items for the role [{ name, href, icon }]
 * @param {Object} branding - Branding configuration { title, icon }
 * @param {boolean} showSearch - Enable/disable search bar
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {function} onSearch - Search handler (optional)
 */
const DashboardLayout = ({
  navigation = [],
  branding = { title: "Dashboard", icon: "hub" },
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
}) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <div className="bg-background dark:bg-background min-h-screen flex flex-col font-display text-foreground dark:text-foreground overflow-x-hidden">
      {/* Top Navigation Bar */}
      <DashboardHeader
        navigation={navigation}
        branding={branding}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        isScrolled={isScrolled}
        onLogoutClick={handleLogoutClick}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
          onClick={() => setIsLogoutModalOpen(false)}>
          <div
            className="border border-border rounded-xl shadow-2xl w-full max-w-md p-6"
            style={{ backgroundColor: "hsl(var(--background))" }}
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground text-center mb-6">
              Log out of your account
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogoutConfirm}
                className="w-full py-3 bg-destructive hover:bg-destructive/90 text-red-500 font-semibold rounded-lg transition-colors text-center">
                Log out
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-colors text-center">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 lg:px-12 pt-20 md:pt-24 pb-8">
        <div className="w-full">
          <div className="flex flex-col gap-6">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Left Drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}>
          <aside
            className="absolute top-0 left-0 h-full w-[82%] max-w-[320px] border-r border-border p-4 pt-20 overflow-y-auto shadow-2xl"
            style={{ backgroundColor: "hsl(var(--card))", opacity: 1 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 pb-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Menu</h3>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center size-8 rounded-md hover:bg-muted text-muted-foreground"
                aria-label="Close menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogoutClick();
              }}
              className="mt-6 w-full py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm font-medium">
              Log out
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
