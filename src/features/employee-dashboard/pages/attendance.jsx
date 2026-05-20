import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Calendar, Clock, CheckCircle, AlertCircle, Briefcase, FileText } from "lucide-react";
import attendanceService from "~/services/attendanceService";
import { toast } from "react-toastify";
import { format } from "date-fns";
// Using available UI components if possible, or fallback to sensible defaults
// I will keep the imports simple to avoid breaking if components differ slightly
// But I will use the classNames from the previous file to try and match style if generic

const AttendancePage = () => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [punchingOut, setPunchingOut] = useState(false);
  const [punchingIn, setPunchingIn] = useState(false);
  const punchOutAttempted = useRef(false);

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
  ];

  const years = [2024, 2025, 2026, 2027];

  // Fetch Data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [todayRes, historyRes, summaryRes] = await Promise.all([
        attendanceService.getTodayAttendance(),
        attendanceService.getAttendanceHistory(currentMonth, currentYear),
        attendanceService.getMonthlySummary(currentMonth, currentYear)
      ]);

      setTodayStatus(todayRes);
      setHistory(historyRes);
      setSummary(summaryRes);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      // toast.error("Failed to load attendance data."); // Suppress on mount if needed, or keep
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentMonth, currentYear]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (todayStatus?.status === 'PUNCHED_IN' && todayStatus.punchIn) {
      interval = setInterval(() => {
        const start = new Date(todayStatus.punchIn).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [todayStatus]);

  // Actions
  const handlePunchIn = async () => {
    if (punchingIn) return; // Prevent duplicate clicks
    setPunchingIn(true);
    try {
      await attendanceService.punchIn({});
      toast.success("Punched In Successfully!");
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.message || "Punch In Failed";
      toast.error(message);
      console.error("Punch In Error:", error);
    } finally {
      setPunchingIn(false);
    }
  };

  const handlePunchOut = async () => {
    if (punchingOut || punchOutAttempted.current) {
      toast.warning("Punch out request is already being processed");
      return;
    }
    
    setPunchingOut(true);
    punchOutAttempted.current = true;
    
    try {
      await attendanceService.punchOut({});
      toast.success("Punched Out Successfully!");
      fetchAllData();
    } catch (error) {
      const message = error.response?.data?.message || "Punch Out Failed";
      toast.error(message);
      console.error("Punch Out Error:", error);
      // Reset flag on error to allow retry
      punchOutAttempted.current = false;
    } finally {
      setPunchingOut(false);
    }
  };

  if (loading && !todayStatus) {
    return <div className="p-6 text-center text-muted-foreground">Loading attendance...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm">Track your daily work hours and history.</p>
        </div>

        {/* Date Filter */}
        <div className="flex gap-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Top Section: Monthly Summary & Today's Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Status Card */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between universal-card-child">
          <div className="universal-card-header mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Today's Status
            </h3>
          </div>

          <div className="text-center py-6">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Current Status</div>
            <div className={`text-2xl font-bold ${todayStatus?.status === 'PUNCHED_IN' ? 'text-green-600' :
              todayStatus?.status === 'PUNCHED_OUT' ? 'text-blue-600' : 'text-muted-foreground'
              }`}>
              {todayStatus?.status === 'PUNCHED_IN' ? 'WORKING' :
                todayStatus?.status === 'PUNCHED_OUT' ? 'COMPLETED' : 'NOT STARTED'}
            </div>

            {todayStatus?.status === 'PUNCHED_IN' && (
              <div className="mt-4 text-4xl font-mono font-bold text-foreground">
                {elapsedTime}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={handlePunchIn}
              disabled={todayStatus?.status === 'PUNCHED_IN' || todayStatus?.status === 'PUNCHED_OUT' || punchingIn}
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {punchingIn ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              ) : (
                <Play size={18} fill="currentColor" />
              )}
              {punchingIn ? "Processing..." : "Punch In"}
            </button>
            <button
              onClick={handlePunchOut}
              disabled={todayStatus?.status !== 'PUNCHED_IN' || punchingOut}
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium border border-input bg-transparent hover:bg-accent text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {punchingOut ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
              ) : (
                <Pause size={18} fill="currentColor" />
              )}
              {punchingOut ? "Processing..." : "Punch Out"}
            </button>
          </div>

          <div className="mt-6 flex justify-between text-xs text-muted-foreground border-t border-border pt-4">
            <span>In: {todayStatus?.punchIn ? format(new Date(todayStatus.punchIn), "hh:mm a") : "--:--"}</span>
            <span>Out: {todayStatus?.punchOut ? format(new Date(todayStatus.punchOut), "hh:mm a") : "--:--"}</span>
          </div>
        </div>

        {/* Start Monthly Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Working Days"
            value={summary?.totalWorkingDays || 0}
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            subtext="This Month"
          />
          <StatCard
            label="Present"
            value={summary?.presentDays || 0}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
            subtext="Days"
          />
          <StatCard
            label="Leaves Taken"
            value={summary?.leaveDays || 0}
            icon={<FileText className="w-5 h-5 text-yellow-500" />}
            subtext="Approved"
          />
          <StatCard
            label="Total Hours"
            value={summary?.totalWorkHours || 0}
            icon={<Clock className="w-5 h-5 text-purple-500" />}
            subtext="Worked"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden universal-card-child">
        <div className="p-6 border-b border-border universal-card-header">
          <h3 className="text-lg font-semibold text-foreground">Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Punch In</th>
                <th className="px-6 py-4">Punch Out</th>
                <th className="px-6 py-4">Total Hours</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.length > 0 ? (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {format(new Date(record.date), "MMM dd, yyyy")}
                      <div className="text-xs text-muted-foreground">{format(new Date(record.date), "EEEE")}</div>
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">
                      {record.punchIn ? format(new Date(record.punchIn), "hh:mm a") : "-"}
                    </td>
                    <td className="px-6 py-4 text-red-500 font-medium">
                      {record.punchOut ? format(new Date(record.punchOut), "hh:mm a") : "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {record.totalHours} hrs
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'PUNCHED_IN' ? 'bg-green-500/10 text-green-600' :
                        record.status === 'PUNCHED_OUT' ? 'bg-blue-500/10 text-blue-600' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                        {record.status === 'PUNCHED_IN' ? 'Overview' :
                          record.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                    No attendance records found for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Stats
const StatCard = ({ label, value, icon, subtext }) => (
  <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow universal-card-child">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-muted rounded-lg">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    {subtext && <div className="text-xs text-muted-foreground mt-1">{subtext}</div>}
  </div>
);

export default AttendancePage;
