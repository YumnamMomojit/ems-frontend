import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, FileText, Ban, Settings, Download } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { name: "Lock Payroll", icon: Lock, path: "/admin/payroll/lock", color: "text-red-600 bg-red-500/10" },
    { name: "Freeze Claims", icon: Ban, path: "/admin/claims/freeze", color: "text-orange-600 bg-orange-500/10" },
    { name: "Export Reports", icon: Download, path: "/admin/reports", color: "text-blue-600 bg-blue-500/10" },
    { name: "System Settings", icon: Settings, path: "/admin/settings", color: "text-muted-foreground bg-muted" },
  ];

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="font-bold text-card-foreground mb-4 text-sm uppercase tracking-wider">Quick Admin Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-muted/50 hover:shadow-sm transition-all group"
          >
            <div className={`p-2 rounded-full mb-2 ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-card-foreground">
              {action.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
