import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import hrApi from "../../services/hr.api";
import { formatDistanceToNow } from "date-fns";

const NotificationSettings = () => {
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
        <section className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <header className="px-6 py-5 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">notifications_active</span>
                    <h3 className="text-lg font-bold text-foreground dark:text-foreground">Notifications</h3>
                </div>
            </header>
            <div className="p-0">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                to={notification.link}
                                className={`block p-4 hover:bg-muted/50 transition-colors cursor-pointer ${notification.isRead ? '' : 'bg-primary/5'}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-1 size-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}>
                                        <span className="material-symbols-outlined text-[20px]">{notification.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-sm font-bold text-foreground ${notification.isRead ? '' : 'text-primary'}`}>
                                                {notification.title}
                                            </p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-muted-foreground">
                        <div className="bg-muted size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[32px] text-muted-foreground/50">notifications_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No notifications</h3>
                        <p className="text-sm">You're all caught up! Check back later for updates.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NotificationSettings;
