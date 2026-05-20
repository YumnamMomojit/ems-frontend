import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "~/lib/theme-provider";
import hrApi from "../services/hr.api";
import { formatDistanceToNow } from "date-fns";

const NotificationPopover = ({ onClose }) => {
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await hrApi.getNotifications();
                setNotifications(res.data.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <>
            {/* Backdrop to close on click outside */}
            <div className="fixed inset-0 z-40" onClick={onClose}></div>

            {/* Popover */}
            <div
                className="absolute top-12 right-0 w-80 md:w-96 rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-foreground dark:text-foreground">Notifications</h3>
                    <div className="flex gap-2">
                        {notifications.length > 0 && (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{notifications.length} New</span>
                        )}
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    to={notification.link}
                                    onClick={onClose}
                                    className={`block p-4 hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}>
                                            <span className="material-symbols-outlined text-[18px]">{notification.icon}</span>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold text-foreground`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1.5">{formatDistanceToNow(new Date(notification.time), { addSuffix: true })}</p>
                                        </div>
                                        <div className="mt-2 size-2 rounded-full bg-primary shrink-0 ml-auto"></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <span className="material-symbols-outlined text-[48px] text-muted-foreground/50 mb-2">notifications_off</span>
                            <p className="text-sm">No new notifications</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-border bg-muted/50 text-center">
                    <Link
                        to="/hr/settings/notifications"
                        onClick={onClose}
                        className="text-xs font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider block w-full py-1"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotificationPopover;
