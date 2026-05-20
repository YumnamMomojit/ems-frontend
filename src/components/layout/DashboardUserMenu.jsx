import React from "react";
import { useAuth } from "~/hooks/AuthContext";

/**
 * DashboardUserMenu Component
 * Displays user avatar, name, and role
 * 
 * @param {boolean} showRole - Whether to display user role
 * @param {boolean} isScrolled - Whether the navbar is scrolled (for styling)
 */
const DashboardUserMenu = ({ showRole = false, isScrolled = false }) => {
    const { user } = useAuth();

    if (!user) return null;

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User';
    const initials = `${user.firstName || 'U'}+${user.lastName || 'N'}`;

    return (
        <div className="flex items-center gap-3 pl-2 border-l border-border/50">

            <div
                className="size-9 rounded-full bg-muted overflow-hidden ring-2 ring-background shadow-sm cursor-pointer"
                title={fullName}
            >
                <img
                    alt={`${fullName} Profile`}
                    className="h-full w-full object-cover"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${initials}&background=random`}
                />
            </div>
        </div>
    );
};

export default DashboardUserMenu;
