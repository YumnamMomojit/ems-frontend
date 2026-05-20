import React from "react";
import { Folder, Files, Users, Shield } from "lucide-react";

const DocumentTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "all", label: "All Documents", icon: Folder },
        { id: "offer_letter", label: "Offer Letters", icon: Files },
        { id: "id_proof", label: "ID Proofs", icon: Shield },
        { id: "education", label: "Education", icon: Files },
        { id: "templates", label: "Templates", icon: Files },
        { id: "reports", label: "Reports", icon: Files },
        { id: "other", label: "Others", icon: Files },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap text-sm font-medium border-b-2 ${isActive
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                    >
                        <tab.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default DocumentTabs;
