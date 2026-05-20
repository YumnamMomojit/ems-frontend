import React from "react";
import { useAuth } from "~/hooks/AuthContext";
import { NavLink, Outlet } from "react-router-dom";

const SettingsLayout = () => {
    const { logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = () => {
        setIsLogoutModalOpen(false);
        logout();
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setIsLogoutModalOpen(false)}>
                    <div
                        className="border border-border rounded-xl shadow-2xl w-96 max-w-md p-6"
                        style={{ backgroundColor: 'hsl(var(--background))' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-bold text-foreground text-center mb-6">
                            Log out of your account
                        </h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogoutConfirm}
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

            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground dark:text-foreground tracking-tight">Personal Settings</h1>
                        <p className="text-muted-foreground mt-1 font-medium">Manage your account preferences, security, and interface theme.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Settings Sidebar */}
                <aside className="lg:col-span-3 sticky top-24">
                    <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden p-2">
                        <nav className="flex flex-col gap-1">
                            <NavLink
                                to="profile"
                                className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all w-full text-left ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">person</span>
                                    Account
                                </div>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </NavLink>
                            <NavLink
                                to="notifications"
                                className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all w-full text-left ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">notifications</span>
                                    Notifications
                                </div>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </NavLink>
                            <button
                                onClick={handleLogoutClick}
                                className="flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">logout</span>
                                    Log out
                                </div>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 pb-20">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
