import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import { useToast } from "~/hooks/use-toast";
import { Calendar, TrendingUp, PieChart as PieChartIcon, BarChart3, Users, CheckCircle, Clock, UserCheck, Download, Settings, Search, Filter } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

const LeaveManagement = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [balances, setBalances] = useState([]);
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [policyModalOpen, setPolicyModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const { toast } = useToast();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [statsRes, analyticsRes, leavesRes, balancesRes, policyRes] = await Promise.all([
                hrApi.getLeaveStats(),
                hrApi.getLeaveAnalytics(),
                hrApi.getLeaves(),
                hrApi.getLeaveBalance(),
                hrApi.getLeavePolicy()
            ]);

            setStats(statsRes.data?.data || statsRes.data);
            setAnalytics(analyticsRes.data?.data || analyticsRes.data);
            setLeaves(leavesRes.data?.data || leavesRes.data);
            setBalances(balancesRes.data?.data || balancesRes.data);
            setPolicy(policyRes.data?.data || policyRes.data);
        } catch (err) {
            console.error("Error fetching leave data:", err);
            toast({ title: "Error", description: "Failed to load leave data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePolicyUpdate = async (data) => {
        try {
            await hrApi.updateLeavePolicy(data);
            toast({ title: "Success", description: "Leave policy updated successfully" });
            setPolicyModalOpen(false);
            fetchAllData();
        } catch (err) {
            toast({ title: "Error", description: "Failed to update policy", variant: "destructive" });
        }
    };

    const handleApproveLeave = async (leaveId) => {
        try {
            await hrApi.approveLeave(leaveId);
            toast({ title: "Success", description: "Leave approved successfully" });
            fetchAllData();
        } catch (err) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to approve leave", variant: "destructive" });
        }
    };

    const handleRejectLeave = async (leaveId) => {
        const reason = prompt("Enter rejection reason (optional):");
        try {
            await hrApi.rejectLeave(leaveId, { reason });
            toast({ title: "Success", description: "Leave rejected" });
            fetchAllData();
        } catch (err) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to reject leave", variant: "destructive" });
        }
    };

    // Chart colors
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
    const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

    // Filter leaves
    const filteredLeaves = leaves.filter(leave => {
        const matchesSearch = `${leave.employee.firstName} ${leave.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || leave.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        };
        return styles[status] || "";
    };

    const getLeaveTypeBadge = (type) => {
        const styles = {
            CASUAL: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            SICK: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        };
        return styles[type] || "";
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return days;
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading leave management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground text-sm">Comprehensive leave overview and analytics</p>
                </div>
                <button
                    onClick={() => setPolicyModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Settings className="h-4 w-4" />
                    Manage Policy
                </button>
            </div>

            {/* 1. Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Requests This Month</p>
                            <p className="text-2xl font-bold">{stats?.totalRequestsThisMonth || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Approved Leaves</p>
                            <p className="text-2xl font-bold">{stats?.approvedLeaves || 0}</p>
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
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">On Leave Today</p>
                            <p className="text-2xl font-bold">{stats?.employeesOnLeaveToday || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Charts */}
            {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Leave Type Distribution */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Leave Type Distribution</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={analytics.leaveTypeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.leaveTypeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Monthly Leave Trend</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                <Legend />
                                <Line type="monotone" dataKey="leaves" stroke="#3b82f6" strokeWidth={2} name="Leaves" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Department-wise Usage */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Department Usage</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.departmentStats}>
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
                                <Bar dataKey="leaves" fill="#10b981" name="Leaves" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* 3. Leave Requests Table */}
            <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="p-6 border-b flex flex-wrap gap-4 items-center justify-between">
                    <h3 className="text-lg font-bold">Leave Requests</h3>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search employee..."
                                className="pl-10 h-10 border rounded-lg text-sm bg-background shadow-md focus:shadow-lg focus:outline-none transition-shadow"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-10 border rounded-lg text-sm bg-background shadow-md focus:shadow-lg focus:outline-none px-3 transition-shadow"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 text-xs uppercase font-bold tracking-wider border-b">
                                <th className="px-6 py-4 text-left">Employee</th>
                                <th className="px-6 py-4 text-left">Department</th>
                                <th className="px-6 py-4 text-left">Leave Type</th>
                                <th className="px-6 py-4 text-left">Start Date</th>
                                <th className="px-6 py-4 text-left">End Date</th>
                                <th className="px-6 py-4 text-left">Duration</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredLeaves.map((leave) => (
                                <tr key={leave.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{`${leave.employee.firstName} ${leave.employee.lastName}`}</div>
                                        <div className="text-xs text-muted-foreground">{leave.employee.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{leave.employee.department?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLeaveTypeBadge(leave.type)}`}>
                                            {leave.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{format(new Date(leave.startDate), 'MMM dd, yyyy')}</td>
                                    <td className="px-6 py-4 text-sm">{format(new Date(leave.endDate), 'MMM dd, yyyy')}</td>
                                    <td className="px-6 py-4 text-sm font-semibold">{calculateDuration(leave.startDate, leave.endDate)} days</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{leave.approvedBy || 'Pending'}</td>
                                    <td className="px-6 py-4">
                                        {leave.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApproveLeave(leave.id)}
                                                    className="px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectLeave(leave.id)}
                                                    className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Leave Balance Summary */}
            <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-bold">Leave Balance Summary</h3>
                    <p className="text-sm text-muted-foreground">Employee leave allocations and usage</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 text-xs uppercase font-bold tracking-wider border-b">
                                <th className="px-6 py-4 text-left">Employee</th>
                                <th className="px-6 py-4 text-left">Department</th>
                                <th className="px-6 py-4 text-left">Casual</th>
                                <th className="px-6 py-4 text-left">Sick</th>
                                <th className="px-6 py-4 text-left">Paid</th>
                                <th className="px-6 py-4 text-left">Total Remaining</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {balances.map((balance) => (
                                <tr key={balance.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{balance.name}</td>
                                    <td className="px-6 py-4 text-sm">{balance.department}</td>
                                    <td className="px-6 py-4 text-sm">{balance.casual}</td>
                                    <td className="px-6 py-4 text-sm">{balance.sick}</td>
                                    <td className="px-6 py-4 text-sm">{balance.paid}</td>
                                    <td className="px-6 py-4 text-sm font-bold">{balance.totalRemaining}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Policy Management Modal */}
            {policyModalOpen && policy && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl max-w-2xl w-full p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Leave Policy Settings</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handlePolicyUpdate({
                                casualLeaves: parseInt(formData.get('casualLeaves')),
                                sickLeaves: parseInt(formData.get('sickLeaves')),
                                paidLeaves: parseInt(formData.get('paidLeaves')),
                                carryForward: formData.get('carryForward') === 'on',
                                maxCarryForward: parseInt(formData.get('maxCarryForward'))
                            });
                        }}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Casual Leaves</label>
                                        <input type="number" name="casualLeaves" defaultValue={policy.casualLeaves} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Sick Leaves</label>
                                        <input type="number" name="sickLeaves" defaultValue={policy.sickLeaves} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Paid Leaves</label>
                                        <input type="number" name="paidLeaves" defaultValue={policy.paidLeaves} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="carryForward" defaultChecked={policy.carryForward} className="h-4 w-4" />
                                    <label className="text-sm font-medium">Allow Carry Forward</label>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Max Carry Forward</label>
                                    <input type="number" name="maxCarryForward" defaultValue={policy.maxCarryForward} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">Save Changes</button>
                                <button type="button" onClick={() => setPolicyModalOpen(false)} className="flex-1 border px-4 py-2 rounded-lg hover:bg-muted">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
