import React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";

const PayrollHeader = ({ selectedDate, onDateChange, status = "Draft" }) => {
    const handlePrevMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onDateChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onDateChange(newDate);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Locked": return "bg-green-100 text-green-700 border-green-200";
            case "Ready": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Payroll</h1>
                <p className="text-muted-foreground text-sm">Manage and finalize monthly employee salaries.</p>
            </div>

            <div className="flex items-center gap-3 bg-card border rounded-lg p-1.5 shadow-sm">
                <button
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="flex flex-col items-center min-w-[120px]">
                    <span className="text-sm font-semibold text-foreground">
                        {format(selectedDate, "MMMM yyyy")}
                    </span>
                </div>
                <button
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(status)}`}>
                {status === "Locked" ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                {status}
            </div>
        </div>
    );
};

export default PayrollHeader;
