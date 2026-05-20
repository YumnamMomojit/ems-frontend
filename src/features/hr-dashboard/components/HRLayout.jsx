import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import NotificationPopover from "./NotificationPopover";

const HRLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Detect scroll to change navbar background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: "Dashboard", href: "/hr/dashboard", icon: "dashboard" },
        { name: "Reports", href: "/hr/reports", icon: "analytics" }, // Replaced individual items with Reports
        { name: "Employees", href: "/hr/employees", icon: "groups" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-background dark:bg-background min-h-screen flex flex-col font-display text-foreground dark:text-foreground overflow-x-hidden">
            {/* Top Navigation Bar */}
            <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${isScrolled
                ? 'bg-gray-900 dark:bg-gray-900 border-gray-800'
                : 'bg-card dark:bg-card border-border'
                } shadow-sm`}>
                <div className="max-w-[1440px] mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-10">
                        <div className={`flex items-center gap-3 ${isScrolled ? 'text-white' : 'text-foreground dark:text-foreground'}`}>
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-[20px]">hub</span>
                            </div>
                            <h2 className="text-xl font-bold leading-tight tracking-tight">HR Portal</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <NavLink to="/hr/dashboard" className={({ isActive }) => `text-sm font-semibold transition-colors ${isScrolled
                                ? (isActive ? "text-white border-b-2 border-white pb-0.5" : "text-gray-300 hover:text-white")
                                : (isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary")
                                }`}>Dashboard</NavLink>
                            <NavLink to="/hr/employees" className={({ isActive }) => `text-sm font-semibold transition-colors ${isScrolled
                                ? (isActive ? "text-white border-b-2 border-white pb-0.5" : "text-gray-300 hover:text-white")
                                : (isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary")
                                }`}>Employees</NavLink>
                            <NavLink to="/hr/reports" className={({ isActive }) => `text-sm font-semibold transition-colors ${isScrolled
                                ? (isActive ? "text-white border-b-2 border-white pb-0.5" : "text-gray-300 hover:text-white")
                                : (isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary")
                                }`}>Reports</NavLink>
                            <NavLink to="/hr/settings" className={({ isActive }) => `text-sm font-semibold transition-colors ${isScrolled
                                ? (isActive ? "text-white border-b-2 border-white pb-0.5" : "text-gray-300 hover:text-white")
                                : (isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary")
                                }`}>Settings</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden sm:block group">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isScrolled ? 'text-gray-400' : 'text-muted-foreground'}`}>
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className={`block w-full rounded-lg border-0 py-2 pl-10 shadow-md focus:shadow-lg focus:outline-none sm:text-sm sm:leading-6 relative min-w-[240px] transition-all ${isScrolled
                                ? 'bg-gray-800 text-white placeholder:text-gray-400 font-medium'
                                : 'text-foreground bg-secondary dark:bg-secondary dark:text-foreground placeholder:text-muted-foreground'
                                }`} placeholder="Search employees..." type="text" />
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="relative">
                                <button
                                    className={`relative p-1 rounded-full transition-colors ${isScrolled ? 'text-white hover:text-primary' : 'text-muted-foreground hover:text-primary'
                                        }`}
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary border-2 border-card"></span>
                                </button>
                                {isNotificationOpen && <NotificationPopover onClose={() => setIsNotificationOpen(false)} />}
                            </div>
                            <div className="flex items-center gap-3 pl-2 border-l border-border/50">
                                <div className="text-right hidden md:block">
                                    <p className={`text-sm font-bold leading-none ${isScrolled ? 'text-white' : 'text-foreground'}`}>{user?.firstName} {user?.lastName}</p>
                                </div>
                                <div className="size-9 rounded-full bg-muted overflow-hidden ring-2 ring-background shadow-sm cursor-pointer" title={user?.name}>
                                    <img
                                        alt="Current User Profile"
                                        className="h-full w-full object-cover"
                                        src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                                    />
                                </div>
                            </div>
                            <button onClick={() => setIsLogoutModalOpen(true)} className={`ml-2 transition-colors ${isScrolled ? 'text-white hover:text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setIsLogoutModalOpen(false)}>
                    <div
                        className="border border-border rounded-xl shadow-2xl w-96 max-w-md p-6"
                        style={{ backgroundColor: 'hsl(var(--background))' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-bold text-foreground text-center mb-6">
                            Log out of your account <br /> {user?.name}
                        </h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setIsLogoutModalOpen(false);
                                    logout();
                                }}
                                className="w-full py-3 bg-destructive hover:bg-destructive/90 text-red-500 font-semibold rounded-lg transition-colors text-center"
                            >
                                Log out
                            </button>
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-colors text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full p-6 md:p-8 lg:px-12 pt-20 md:pt-24">
                <div className="w-full">
                    {/* Main Content Area */}
                    <div className="flex flex-col gap-6">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Nav Bar (Bottom) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-card dark:bg-card border-t border-border z-40 px-6 py-2">
                <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                    {navigation.slice(0, 3).map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-primary" : ""}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined">menu</span>
                        More
                    </button>
                </div>
            </div>

            {/* Simple Mobile Menu Drawer (if needed, or just rely on navigating to a full menu page) */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute bottom-16 left-0 w-full bg-card dark:bg-card p-4 rounded-t-xl border-t border-border">
                        <nav className="grid grid-cols-3 gap-4">
                            {navigation.slice(3).map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) => `flex flex-col items-center gap-2 p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    <span className="text-xs text-center">{item.name}</span>
                                </NavLink>
                            ))}
                            <button onClick={logout} className="flex flex-col items-center gap-2 p-2 rounded-lg text-red-500">
                                <span className="material-symbols-outlined">logout</span>
                                <span className="text-xs">Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HRLayout;
