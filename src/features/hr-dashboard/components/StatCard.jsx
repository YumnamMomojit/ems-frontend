import React from "react";

const StatCard = ({ title, value, icon, description, trend, trendType }) => {
    return (
        <div className="bg-card dark:bg-card p-5 rounded-xl border border-border shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors cursor-default">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <p className="text-2xl font-bold text-foreground dark:text-foreground">{value}</p>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                {trend && (
                    <p className={`text-xs mt-1 ${trendType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {trend}
                    </p>
                )}
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>
    );
};

export default StatCard;
