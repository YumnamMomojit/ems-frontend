import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import AttendanceTable from "../components/AttendanceTable";
import { format } from "date-fns";
import { Search, Filter, Calendar as CalendarIcon, TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: format(new Date(), "yyyy-MM-dd"),
        department: ""
    });

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await hrApi.getAttendance(filters);
            setAttendance(res.data.data);
        } catch (err) {
            console.error("Error fetching attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const res = await hrApi.getAttendanceStats();
            setStats(res.data.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
        fetchStats();
    }, [filters]);

    // Chart colors
    const COLORS = {
        present: '#10b981', // green
        absent: '#ef4444',   // red  
        late: '#f59e0b'      // orange
    };

    const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

    // Prepare pie chart data
    const pieData = stats?.statusDistribution ? [
        { name: 'Present', value: stats.statusDistribution.present },
        { name: 'Absent', value: stats.statusDistribution.absent },
        { name: 'Late', value: stats.statusDistribution.late }
    ].filter(item => item.value > 0) : [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Attendance Analytics</h1>
                    <p className="text-muted-foreground text-sm">Monitor daily attendance and track trends.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="date"
                            className="pl-10 h-10 border rounded-lg text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {statsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-card border rounded-2xl p-6 h-80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ))}
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daily Trend Chart */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Daily Attendance Trend</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={stats.dailyTrend}>
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
                                <Line type="monotone" dataKey="present" stroke={COLORS.present} strokeWidth={2} name="Present" />
                                <Line type="monotone" dataKey="late" stroke={COLORS.late} strokeWidth={2} name="Late" />
                                <Line type="monotone" dataKey="absent" stroke={COLORS.absent} strokeWidth={2} name="Absent" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Status Distribution</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    Present
                                </span>
                                <span className="font-semibold">{stats.statusDistribution.present}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    Absent
                                </span>
                                <span className="font-semibold">{stats.statusDistribution.absent}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                    Late
                                </span>
                                <span className="font-semibold">{stats.statusDistribution.late}</span>
                            </div>
                        </div>
                    </div>

                    {/* Department Comparison */}
                    <div className="bg-card border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">Department Comparison</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.departmentStats}>
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
                                <Bar dataKey="present" fill={COLORS.present} name="Present" />
                                <Bar dataKey="late" fill={COLORS.late} name="Late" />
                                <Bar dataKey="absent" fill={COLORS.absent} name="Absent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : null}

            <AttendanceTable data={attendance} loading={loading} />
        </div>
    );
};

export default Attendance;
