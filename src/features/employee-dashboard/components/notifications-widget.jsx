import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Badge } from "~/components/employee-ui/badge";

const notificationIcons = {
    success: CheckCircle,
    warning: AlertCircle,
    info: Bell,
    pending: Clock,
};

const notificationColors = {
    success: "text-green-500 bg-green-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    info: "text-blue-500 bg-blue-500/10",
    pending: "text-orange-500 bg-orange-500/10",
};

export function NotificationsWidget({ notifications = [] }) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="h-full" data-testid="notifications-widget">
                <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            Notifications
                        </CardTitle>
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="rounded-full px-2">
                                {unreadCount} New
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification, index) => {
                            const Icon = notificationIcons[notification.type] || Bell;
                            const colorClass = notificationColors[notification.type] || notificationColors.info;

                            return (
                                <div
                                    key={notification.id || index}
                                    className="flex gap-3 items-start group relative"
                                >
                                    <div className={`p-2 rounded-full shrink-0 ${colorClass}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none mb-1 group-hover:text-primary transition-colors">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {notification.time}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-primary absolute right-0 top-1" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
