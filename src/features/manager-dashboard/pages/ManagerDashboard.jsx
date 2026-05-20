import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import OverviewCards from "../components/OverviewCards";
import { AlertCircle } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import DashboardWelcome from "~/components/layout/DashboardWelcome";

const ManagerDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await managerService.getDashboardSummary();
                setSummary(data);
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Failed to load dashboard summary");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
            </div>
        );
    }

    return (
        <div className="universal-card-parent">
            <DashboardWelcome />

            <OverviewCards summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl border shadow-sm universal-card-child">
                    <h3 className="text-lg font-semibold mb-4">Attendance Trend (Last 7 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summary.attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-xl border shadow-sm universal-card-child">
                    <h3 className="text-lg font-semibold mb-4">Team Composition</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={summary.designationDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {summary.designationDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-xl border shadow-sm universal-card-child">
                <h3 className="text-lg font-semibold mb-4">Pending Tasks</h3>
                <p className="text-sm text-muted-foreground">Actionable items requiring your attention.</p>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>Leave Requests</span>
                        <span className="font-bold">{summary.pendingLeaves}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>Expense Claims</span>
                        <span className="font-bold">{summary.pendingExpenses}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>Worksheets</span>
                        <span className="font-bold">{summary.pendingWorksheets}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
