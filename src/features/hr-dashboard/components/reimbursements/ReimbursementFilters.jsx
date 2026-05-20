import React from "react";
import { Search, Filter, Calendar } from "lucide-react";

const ReimbursementFilters = ({ filters, onFilterChange }) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-background border rounded-xl shadow-sm">
            {/* Search */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                    value={filters.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:border-primary"
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="PAID">Paid</option>
                </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:border-primary"
                />
                <span className="text-muted-foreground">-</span>
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:border-primary"
                />
            </div>
        </div>
    );
};

export default ReimbursementFilters;
