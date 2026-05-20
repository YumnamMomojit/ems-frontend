import React from "react";
import { FileText, AlertTriangle, FileBadge, Folder } from "lucide-react";

const DocumentStats = ({ stats, loading }) => {
    const items = [
        {
            label: "Total Documents",
            value: stats?.totalDocuments || 0,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            label: "Missing Mandatory",
            value: stats?.missingMandatory || 0,
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-100"
        },
        {
            label: "Company Templates",
            value: stats?.templates || 0,
            icon: FileBadge,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            label: "Categories",
            value: 8,
            icon: Folder,
            color: "text-green-600",
            bg: "bg-green-100"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <div key={index} className="bg-card border rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-lg ${item.bg}`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                        <h3 className="text-xl font-bold text-foreground">{item.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DocumentStats;
