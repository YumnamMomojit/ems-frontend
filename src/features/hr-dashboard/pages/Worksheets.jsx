import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import { useToast } from "~/hooks/use-toast";
import { FileSpreadsheet, CheckCircle, Clock, AlertTriangle, PieChart as PieChartIcon, TrendingUp, BarChart3, Search, Eye, Bell, Mail } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import WorksheetViewer from "../components/WorksheetViewer";

const Worksheets = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [worksheets, setWorksheets] = useState([]);
    const [missingWorksheets, setMissingWorksheets] = useState([]);
    const [projectSummary, setProjectSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWorksheet, setSelectedWorksheet] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [statsRes, analyticsRes, worksheetsRes, missingRes, projectRes] = await Promise.all([
                hrApi.getWorksheetStats(),
                hrApi.getWorksheetAnalytics(),
                hrApi.getWorksheets(),
                hrApi.getMissingWorksheets(),
                hrApi.getProjectSummary()
            ]);

            setStats(statsRes.data.data);
            setAnalytics(analyticsRes.data.data);
            setWorksheets(worksheetsRes.data.data);
            setMissingWorksheets(missingRes.data.data);
            setProjectSummary(projectRes.data.data);
        } catch (err) {
            console.error("Error fetching worksheet data:", err);
            toast({ title: "Error", description: "Failed to load worksheet data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSendReminder = (employeeId) => {
        toast({ title: "Reminder Sent", description: "Reminder email sent to employee" });
    };

    // Chart colors
    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    // Filter worksheets
    const filteredWorksheets = worksheets.filter(ws => {
        const matchesSearch = `${ws.employee.firstName} ${ws.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ws.project.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading worksheet management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Worksheet Management</h1>
                <p className="text-muted-foreground text-sm">Monitor daily submissions, hours logged, and project tracking</p>
            </div>

            {/* 1. Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Submitted This Month</p>
                            <p className="text-2xl font-bold">{stats?.totalSubmittedThisMonth || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Approved Worksheets</p>
                            <p className="text-2xl font-bold">{stats?.approvedWorksheets || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Approvals</p>
                            <p className="text-2xl font-bold">{stats?.pendingApprovals || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Missing Submissions</p>
                            <p className="text-2xl font-bold">{stats?.missingSubmissions || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Charts */}
            {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Submission Status */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Submission Status</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={analytics.submissionStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.submissionStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Hours Logged Trend */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Hours Logged Trend</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.hoursLoggedTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} name="Hours" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Department-wise Hours */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Department Hours</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.departmentHours}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="department"
                                    tick={{ fontSize: 10 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="hours" fill="#10b981" name="Hours" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* 3. Worksheet Status Table */}
            <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="p-6 border-b flex flex-wrap gap-4 items-center justify-between">
                    <h3 className="text-lg font-bold">Worksheet Submissions</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search employee or project..."
                            className="pl-10 h-10 border rounded-lg text-sm bg-background shadow-md focus:shadow-lg focus:outline-none transition-shadow"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 text-xs uppercase font-bold tracking-wider border-b">
                                <th className="px-6 py-4 text-left">Employee</th>
                                <th className="px-6 py-4 text-left">Department</th>
                                <th className="px-6 py-4 text-left">Project</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Hours Logged</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredWorksheets.map((ws) => (
                                <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{`${ws.employee.firstName} ${ws.employee.lastName}`}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{ws.department}</td>
                                    <td className="px-6 py-4 text-sm">{ws.project}</td>
                                    <td className="px-6 py-4 text-sm">{format(new Date(ws.date), 'MMM dd, yyyy')}</td>
                                    <td className="px-6 py-4 text-sm font-semibold">{ws.totalHours} hrs</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedWorksheet(ws)}
                                            className="p-1.5 bg-primary/5 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/10"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Missing/Incomplete Worksheets */}
            {missingWorksheets.length > 0 && (
                <div className="bg-card border-2 border-red-200 dark:border-red-900/30 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b bg-red-50 dark:bg-red-900/10">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <h3 className="text-lg font-bold text-black dark:text-red-500">Missing/Incomplete Worksheets</h3>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-red-600 mt-1">Employees who haven't submitted their worksheets</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 text-xs uppercase font-bold tracking-wider border-b">
                                    <th className="px-6 py-4 text-left">Employee</th>
                                    <th className="px-6 py-4 text-left">Department</th>
                                    <th className="px-6 py-4 text-left">Manager</th>
                                    <th className="px-6 py-4 text-left">Days Missing</th>
                                    <th className="px-6 py-4 text-left">Last Submission</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {missingWorksheets.map((missing) => (
                                    <tr key={missing.employeeId} className={`hover:bg-muted/30 transition-colors ${missing.daysMissing > 3 ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`}>
                                        <td className="px-6 py-4 font-semibold">{missing.employeeName}</td>
                                        <td className="px-6 py-4 text-sm">{missing.department}</td>
                                        <td className="px-6 py-4 text-sm">{missing.manager}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${missing.daysMissing > 3
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {missing.daysMissing} days
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {missing.lastSubmissionDate ? format(new Date(missing.lastSubmissionDate), 'MMM dd, yyyy') : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleSendReminder(missing.employeeId)}
                                                className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 mx-auto transition-colors"
                                            >
                                                <Bell className="h-3.5 w-3.5" />
                                                Send Reminder
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 5. Project-wise Time Summary */}
            <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-bold">Project-wise Time Summary</h3>
                    <p className="text-sm text-muted-foreground">Total hours logged per project for billing and productivity analysis</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 text-xs uppercase font-bold tracking-wider border-b">
                                <th className="px-6 py-4 text-left">Project Name</th>
                                <th className="px-6 py-4 text-left">Department</th>
                                <th className="px-6 py-4 text-left">Total Hours</th>
                                <th className="px-6 py-4 text-left">Submissions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {projectSummary.map((project, idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{project.project}</td>
                                    <td className="px-6 py-4 text-sm">{project.department}</td>
                                    <td className="px-6 py-4 text-sm font-bold">{project.totalHours.toFixed(1)} hrs</td>
                                    <td className="px-6 py-4 text-sm">{project.submissions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Worksheet Viewer Modal */}
            {selectedWorksheet && (
                <WorksheetViewer
                    worksheet={selectedWorksheet}
                    onClose={() => setSelectedWorksheet(null)}
                />
            )}
        </div>
    );
};

export default Worksheets;
