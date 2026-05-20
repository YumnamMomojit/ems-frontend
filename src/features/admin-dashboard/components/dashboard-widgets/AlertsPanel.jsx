import React from "react";
import { AlertCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AlertsPanel = ({ alerts }) => {
    const navigate = useNavigate();

    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-card-foreground flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-muted-foreground" />
                        System Alerts
                    </h3>
                </div>
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                        <UserCheck className="w-6 h-6 text-green-500" />
                    </div>
                    No System Alerts. Everything looks healthy!
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-card-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    System Alerts ({alerts.length})
                </h3>
            </div>

            <div className="space-y-3">
                {alerts.map((alert, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 flex items-start justify-between cursor-pointer hover:bg-muted/50 transition-colors ${alert.type === 'CRITICAL' ? 'border-red-500 bg-red-500/10' : 'border-orange-500 bg-orange-500/10'
                            }`}
                        onClick={() => navigate(alert.link)}
                    >
                        <div>
                            <p className={`text-sm font-medium ${alert.type === 'CRITICAL' ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400'
                                }`}>
                                {alert.message}
                            </p>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mt-1 block">
                                {alert.type}
                            </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper icon
function UserCheck(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    );
}

export default AlertsPanel;
