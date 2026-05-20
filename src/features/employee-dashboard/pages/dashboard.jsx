import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // Ensure date-fns is installed
import {
  Clock,
  Calendar,
  FileText,
  Briefcase,
  User,
  LogOut,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Plus
} from "lucide-react";
import employeeService from "../../../services/employeeService";
import attendanceService from "../../../services/attendanceService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"); // Default from HR

  // New State for Punch Clock
  const [todayStatus, setTodayStatus] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [punchLoading, setPunchLoading] = useState(false);

  // Fetch Dashboard Data
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ["employeeDashboard"],
    queryFn: employeeService.getDashboardData,
    refetchInterval: 60000,
  });

  // Fetch Attendance Status (Independent of Dashboard Data for realtime updates)
  const fetchAttendanceStatus = async () => {
    try {
      const status = await attendanceService.getTodayAttendance();
      setTodayStatus(status);
    } catch (err) {
      console.error("Error fetching attendance status:", err);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  // Timer Logic (Synced with Attendance Page)
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

  // Handlers
  const handlePunchIn = async () => {
    setPunchLoading(true);
    try {
      await attendanceService.punchIn({});
      toast.success("Punched In Successfully!");
      await fetchAttendanceStatus();
      refetch(); // Update dashboard stats
    } catch (error) {
      toast.error(error.response?.data?.message || "Punch In Failed");
    } finally {
      setPunchLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setPunchLoading(true);
    try {
      await attendanceService.punchOut({});
      toast.success("Punched Out Successfully!");
      await fetchAttendanceStatus();
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Punch Out Failed");
    } finally {
      setPunchLoading(false);
    }
  };

  // Helper for static duration display (for finished days)
  const calculateDuration = (start, end) => {
    if (!start || !end) return "00:00:00";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = endTime - startTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading dashboard</div>;
  if (!dashboardData) return <div className="flex justify-center items-center h-screen">No Data Available</div>;

  const { user, today, leaveBalance, monthlyStats, recentActivity } = dashboardData;



  return (
    <div className="animate-in fade-in duration-500">
      {/* 1️⃣ Cover Photo & Profile Section (HR Style) */}
      <div className="relative w-full rounded-2xl bg-card dark:bg-card shadow-sm border border-border mb-8">
        <div className="overflow-visible rounded-t-2xl">
          <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${coverImage}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[2px]"></div>

            {/* Pencil Edit Button with Popup */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => setIsCoverModalOpen(!isCoverModalOpen)}
                className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all"
                title="Edit Cover Image"
              >
                {/* Reusing lucide-react as originally imported */}
                <Plus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>

              {isCoverModalOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCoverModalOpen(false)}
                  ></div>
                  <div className="absolute top-full right-0 mt-2 bg-card dark:bg-card border border-border rounded-lg shadow-xl z-50 w-64 text-left">
                    <div className="p-3 border-b border-border">
                      <h3 className="font-semibold text-sm text-foreground">Cover photo</h3>
                    </div>
                    <div className="p-3">
                      <input
                        type="file"
                        id="coverImageInput"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="coverImageInput"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md cursor-pointer transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Edit image
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="px-8 pb-8 relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-full border-4 border-background dark:border-card shadow-lg overflow-hidden bg-background">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className={`absolute bottom-2 right-2 h-6 w-6 border-2 border-background dark:border-card rounded-full ${today.isClockedIn ? 'bg-green-500' : 'bg-gray-400'}`} title="Online"></div>
          </div>
          {/* Basic Info */}
          <div className="flex-1 mb-2">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Welcome, {user.firstName}</h1>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                {user.role}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground dark:text-muted-foreground text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Briefcase size={16} />
                {user.designation}
              </span>
              <span className="hidden sm:block text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1.5">
                <User size={16} />
                {user.department}
              </span>
              <span className="hidden sm:block text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-indigo-500 font-medium">Reports to: {user.reportingManager}</span>
              </span>
            </div>
          </div>
          <div className="text-right hidden md:block mb-3">
            <p className="text-sm font-medium text-muted-foreground">{format(currentTime, "EEEE, MMMM do, yyyy")}</p>
            <p className="text-3xl font-mono font-bold text-foreground">{format(currentTime, "hh:mm:ss a")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2️⃣ Attendance Status Card (MAIN) - Professional Styles */}
            <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden relative">
              <div className="p-6">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Attendance
                </h3>

                <div className="flex flex-col justify-center items-center py-6">
                  <div className="text-5xl font-mono font-bold text-foreground mb-4 tracking-tight">
                    {/* Display Live Timer if Punched In, else 00:00:00 or Final Duration */}
                    {todayStatus?.status === 'PUNCHED_IN' ? elapsedTime :
                      todayStatus?.status === 'PUNCHED_OUT' && todayStatus.punchIn && todayStatus.punchOut ?
                        calculateDuration(todayStatus.punchIn, todayStatus.punchOut) : "00:00:00"}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${todayStatus?.status === 'PUNCHED_IN' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    todayStatus?.status === 'PUNCHED_OUT' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                    {todayStatus?.status === 'PUNCHED_IN' ? 'Active Session' :
                      todayStatus?.status === 'PUNCHED_OUT' ? 'Completed' : 'Not Started'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={handlePunchIn}
                    disabled={todayStatus?.status === 'PUNCHED_IN' || todayStatus?.status === 'PUNCHED_OUT' || punchLoading}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <Play size={16} fill="currentColor" /> Punch In
                  </button>
                  <button
                    onClick={handlePunchOut}
                    disabled={todayStatus?.status !== 'PUNCHED_IN' || punchLoading}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm border border-input bg-transparent hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Pause size={16} fill="currentColor" /> Punch Out
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Punch In</p>
                    <p className="font-medium text-foreground">{todayStatus?.punchIn ? format(new Date(todayStatus.punchIn), "hh:mm a") : "--:--"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Punch Out</p>
                    <p className="font-medium text-foreground">{todayStatus?.punchOut ? format(new Date(todayStatus.punchOut), "hh:mm a") : "--:--"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Duration</p>
                    <p className="font-medium text-foreground">{todayStatus?.punchOut && todayStatus?.punchIn ?
                      (Math.abs(new Date(todayStatus.punchOut) - new Date(todayStatus.punchIn)) / 36e5).toFixed(2) + " hrs" :
                      todayStatus?.punchIn ? ((new Date() - new Date(todayStatus.punchIn)) / 36e5).toFixed(2) + " hrs" : "0.0 hrs"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3️⃣ Worksheet Status Card - Professional Styles */}
            <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
                  <FileText className="w-4 h-4" /> Worksheet
                </h3>
                <div className="py-2">
                  {today.worksheetSubmitted ? (
                    <div className="text-center py-6">
                      <div className="mx-auto w-12 h-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-foreground">Submitted</p>
                      <p className="text-xs text-muted-foreground mt-1">Daily report filed</p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto w-12 h-12 bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-foreground">Pending</p>
                      <p className="text-xs text-muted-foreground mt-1">Required for checkout</p>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/employee/worksheets')}
                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${today.worksheetSubmitted
                  ? 'border border-input bg-transparent hover:bg-accent text-foreground'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                  }`}
              >
                {today.worksheetSubmitted ? "View Report" : "Fill Worksheet"} <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 6️⃣ Recent Activity Section - Professional Styles */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              <button onClick={() => navigate('/employee/attendance')} className="text-xs font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.attendance.length > 0 ? recentActivity.attendance.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/30 flex items-center justify-between transition-colors text-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Attendance</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(log.date), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{log.totalHours} hrs</p>
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      {log.status === 'COMPLETED' ? <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> : <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                      {log.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="p-6 text-center text-muted-foreground text-sm">No recent activity.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">

          {/* 5️⃣ Monthly Summary Card - Professional Styles */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Monthly Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Working Days</p>
                <p className="text-xl font-bold text-foreground">{monthlyStats.workingDays}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Present</p>
                <p className="text-xl font-bold text-foreground">{monthlyStats.presentDays}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Leaves</p>
                <p className="text-xl font-bold text-foreground">{monthlyStats.leavesTaken}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Total Hours</p>
                <p className="text-xl font-bold text-foreground">{monthlyStats.totalHours}</p>
              </div>
            </div>
          </div>

          {/* 4️⃣ Leave Balance Overview - Professional Styles */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2 uppercase tracking-wider">
              <LogOut className="w-4 h-4" /> Leave Balance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/30">
                <span className="text-sm font-medium text-foreground">Casual Leave</span>
                <span className="text-sm font-bold text-foreground">{leaveBalance.casualLeave.remaining} <span className="text-muted-foreground font-normal">/ {leaveBalance.casualLeave.total}</span></span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/30">
                <span className="text-sm font-medium text-foreground">Sick Leave</span>
                <span className="text-sm font-bold text-foreground">{leaveBalance.sickLeave.remaining} <span className="text-muted-foreground font-normal">/ {leaveBalance.sickLeave.total}</span></span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/30">
                <span className="text-sm font-medium text-foreground">Privilege Leave</span>
                <span className="text-sm font-bold text-foreground">{leaveBalance.privilegeLeave.remaining} <span className="text-muted-foreground font-normal">/ {leaveBalance.privilegeLeave.total}</span></span>
              </div>
            </div>
            <button
              onClick={() => navigate('/employee/leave')}
              className="w-full mt-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:text-primary/80 transition-colors border-t border-border pt-4"
            >
              Apply for Leave
            </button>
          </div>

          {/* 7️⃣ Quick Actions Section - Professional Styles */}
          <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/employee/attendance')} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left text-sm text-foreground group">
                <Clock size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Attendance History</span>
              </button>
              <button onClick={() => navigate('/employee/expenses')} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left text-sm text-foreground group">
                <Briefcase size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Reimbursements</span>
              </button>
              <button onClick={() => navigate('/employee/payroll')} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left text-sm text-foreground group">
                <FileText size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Salary Slips</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
