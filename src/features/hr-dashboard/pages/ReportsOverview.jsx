import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import { User } from "lucide-react";

const ReportsOverview = () => {
    const [stats, setStats] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await hrApi.getReportsOverview();
                setStats(res.data.data.kpis);
                setReportData(res.data.data.reportData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading reports...</div>;
    }

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden h-full">
            {/* Main Statistics and Table Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-card dark:bg-card p-5 rounded-xl border border-border shadow-lg group hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined">event_available</span>
                            </div>
                            {/* Trend Mockup for now */}
                            {/* <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2.4%</span> */}
                        </div>
                        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Avg Attendance %</h3>
                        <p className="text-2xl font-black text-foreground dark:text-foreground">{stats?.avgAttendance}%</p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-card dark:bg-card p-5 rounded-xl border border-border shadow-lg group hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                        </div>
                        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Late Arrivals</h3>
                        <p className="text-2xl font-black text-foreground dark:text-foreground">{stats?.lateArrivals}</p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-card dark:bg-card p-5 rounded-xl border border-border shadow-lg group hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined">running_with_errors</span>
                            </div>
                        </div>
                        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Missing Punches</h3>
                        <p className="text-2xl font-black text-foreground dark:text-foreground">{stats?.missingPunches}</p>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-card dark:bg-card p-5 rounded-xl border border-border shadow-lg group hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined">logout</span>
                            </div>
                        </div>
                        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Early Exits</h3>
                        <p className="text-2xl font-black text-foreground dark:text-foreground">{stats?.earlyExits}</p>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-card dark:bg-card rounded-xl border border-border shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border flex flex-wrap gap-4 items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground dark:text-foreground">Attendance Detail Report</h3>
                        <div className="flex gap-2">
                            <div className="relative">
                                {/* Search Logic skipped for MVP brevity, can add later */}
                                <input className="bg-muted dark:bg-muted border-transparent dark:border-border rounded-lg text-sm px-3 py-1.5 pl-9 w-64 focus:ring-primary focus:border-primary text-foreground" placeholder="Filter rows..." type="text" />
                                <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-muted-foreground text-[18px]">filter_list</span>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 dark:bg-muted/50 text-foreground dark:text-foreground text-[11px] uppercase font-bold tracking-widest border-b border-border">
                                    <th className="px-6 py-4">Employee ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Check-in</th>
                                    <th className="px-6 py-4">Check-out</th>
                                    <th className="px-6 py-4">Total Hours</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-foreground dark:text-foreground">
                                {reportData.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">No attendance records found.</td>
                                    </tr>
                                ) : (
                                    reportData.map((row) => (
                                        <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium">{row.employeeId}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-muted dark:bg-muted overflow-hidden flex items-center justify-center">
                                                        {row.avatar ? (
                                                            <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-semibold">{row.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(row.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm">{row.checkIn}</td>
                                            <td className="px-6 py-4 text-sm">{row.checkOut}</td>
                                            <td className="px-6 py-4 text-sm">{row.totalHours}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.statusColor}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Trend Insight Sidebar */}
            <aside className="w-full lg:w-80 border-l border-border p-8 overflow-y-auto custom-scrollbar relative z-0">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-foreground dark:text-foreground">Trend Insight</h3>
                    <span className="material-symbols-outlined text-muted-foreground cursor-pointer">info</span>
                </div>
                {/* Trend Chart Mockup - Keeping abstract for now as data fetching for charts is complex */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Monthly Activity</p>
                    <div className="h-48 w-full bg-muted/20 rounded-xl flex items-center justify-center border border-dashed border-border">
                        <span className="text-xs text-muted-foreground">Chart Loading...</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-card dark:bg-card rounded-xl p-4 border border-border">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Insight Summary</p>
                        <p className="text-sm leading-relaxed text-foreground dark:text-foreground">
                            Late arrivals are tracking at <span className="font-bold text-primary">{stats?.lateArrivals}</span> this month.
                            Avg attendance is <span className="font-bold text-emerald-500">{stats?.avgAttendance}%</span>.
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default ReportsOverview;
