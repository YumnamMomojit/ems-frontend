import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHRDashboard from "../hooks/useHRDashboard";
import StatCard from "../components/StatCard";
import ApprovalTable from "../components/ApprovalTable";
import hrApi from "../services/hr.api";
import { useToast } from "~/hooks/use-toast";
import BarChartComponent from "../../admin-dashboard/components/charts/BarChartComponent";
import PieChartComponent from "../../admin-dashboard/components/charts/PieChartComponent";
import { useAuth } from "~/hooks/AuthContext";
import { Pencil, X } from "lucide-react";

import { getEmployeeProfile } from "~/services/employee.api";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { stats, loading, refreshStats } = useHRDashboard();
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [pendingReimbursements, setPendingReimbursements] = useState([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const { toast } = useToast();
    const [employeeName, setEmployeeName] = useState(user?.firstName ? `${user.firstName} ${user.lastName}` : "");
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80");

    const fetchPendingData = async () => {
        setLoadingTables(true);
        try {
            const [leavesRes, reimbursementsRes, profileRes, attendanceStatsRes] = await Promise.all([
                hrApi.getLeaves(),
                hrApi.getReimbursements(),
                getEmployeeProfile(),
                hrApi.getAttendanceStats()
            ]);

            if (profileRes.employee) {
                setEmployeeName(`${profileRes.employee.firstName} ${profileRes.employee.lastName}`);
            }

            setPendingLeaves(leavesRes.data.data.filter(l => l.status === "PENDING").slice(0, 5));
            setPendingReimbursements(reimbursementsRes.data.data.filter(r => r.status === "PENDING").slice(0, 5));

            if (attendanceStatsRes.data.success) {
                setWeeklyStats(attendanceStatsRes.data.data.weeklyStats);
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoadingTables(false);
        }
    };

    useEffect(() => {
        fetchPendingData();
    }, []);

    const handleApproveLeave = async (id) => {
        try {
            await hrApi.approveLeave(id);
            toast({ title: "Approved", description: "Leave request approved." });
            fetchPendingData();
            refreshStats();
        } catch (err) {
            toast({ title: "Error", description: "Failed to approve leave.", variant: "destructive" });
        }
    };

    const handleRejectLeave = async (id) => {
        try {
            await hrApi.rejectLeave(id);
            toast({ title: "Rejected", description: "Leave request rejected." });
            fetchPendingData();
            refreshStats();
        } catch (err) {
            toast({ title: "Error", description: "Failed to reject leave.", variant: "destructive" });
        }
    };

    const attendanceChartData = [
        { name: "Present", value: stats?.presentToday || 0 },
        { name: "On Leave", value: stats?.onLeaveToday || 0 },
        { name: "Absent", value: (stats?.totalEmployees || 0) - (stats?.presentToday || 0) - (stats?.onLeaveToday || 0) },
    ];

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
                setIsCoverModalOpen(false);
                toast({ title: "Success", description: "Cover image updated successfully!" });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Profile Header Section (From Template) */}
            <div className="relative w-full rounded-2xl bg-card dark:bg-card shadow-sm border border-border mb-8">
                {/* Blurred Background with overflow-visible to show popup */}
                <div className="overflow-visible rounded-t-2xl">
                    <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${coverImage}')` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[2px]"></div>

                        {/* Pencil Edit Button with Popup */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <button
                                onClick={() => {
                                    console.log('Pencil icon clicked, current state:', isCoverModalOpen);
                                    setIsCoverModalOpen(!isCoverModalOpen);
                                }}
                                className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all"
                                title="Edit Cover Image"
                            >
                                <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </button>

                            {/* Popup Menu */}
                            {isCoverModalOpen && (
                                <>
                                    {/* Backdrop to close popup */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsCoverModalOpen(false)}
                                    ></div>

                                    {/* Popup content - Dropdown below pencil */}
                                    <div className="absolute top-full right-0 mt-2 bg-card dark:bg-card border border-border rounded-lg shadow-xl z-50 w-64">
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
                                                <Pencil className="h-4 w-4" />
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
                            <img alt="Profile" className="h-full w-full object-cover" src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`} />
                        </div>
                        <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-2 border-background dark:border-card rounded-full" title="Online"></div>
                    </div>
                    {/* Basic Info */}
                    <div className="flex-1 mb-2">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-foreground dark:text-foreground">{employeeName || `${user?.firstName} ${user?.lastName}`}</h1>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                                {user?.role}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground dark:text-muted-foreground text-sm font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">work</span>
                                {employeeName || `${user?.firstName} ${user?.lastName}`}
                            </span>
                            <span className="hidden sm:block text-muted-foreground/40">•</span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                Corporate Office
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards - using new component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Employees"
                    value={stats?.totalEmployees || 0}
                    icon="groups"
                    description="Active staff members"
                />
                <StatCard
                    title="Present Today"
                    value={stats?.presentToday || 0}
                    icon="how_to_reg"
                    description="Employees punched in"
                    trend={`${Math.round(((stats?.presentToday || 0) / (stats?.totalEmployees || 1)) * 100)}% attendance`}
                    trendType="positive"
                />
                <StatCard
                    title="On Leave Today"
                    value={stats?.onLeaveToday || 0}
                    icon="event_busy"
                    description="Approved leave requests"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats?.pendingApprovals || 0}
                    icon="pending_actions"
                    description="Needs your attention"
                    trend={`${stats?.breakdown?.pendingLeaves || 0} L, ${stats?.breakdown?.pendingReimbursements || 0} E`}
                />
            </div>

            {/* Charts Section - Wrapped in Template Logic if possible or kept clean */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <BarChartComponent
                        title="Monthly Attendance Summary"
                        data={weeklyStats.length > 0 ? weeklyStats : [
                            { name: "Week 1", present: 0, absent: 0 },
                            { name: "Week 2", present: 0, absent: 0 },
                            { name: "Week 3", present: 0, absent: 0 },
                            { name: "Week 4", present: 0, absent: 0 },
                        ]} // Fallback or initial state
                        dataKey="name"
                        bars={[
                            { dataKey: "present", fill: "hsl(var(--primary))", name: "Present" },
                            { dataKey: "absent", fill: "#ef4444", name: "Absent" } // Red for absent
                        ]}
                    />
                </div>
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <PieChartComponent
                        title="Attendance Today"
                        data={attendanceChartData}
                        dataKey="value"
                        nameKey="name"
                    />
                </div>
            </div>

            {/* Pending Approvals Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Recent Leave Requests */}
                <section className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <header className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">event_busy</span>
                            <h3 className="font-bold text-foreground dark:text-foreground">Recent Leave Requests</h3>
                        </div>
                        <button
                            className="text-xs font-semibold text-muted-foreground hover:text-primary uppercase tracking-wide flex items-center gap-1"
                            onClick={() => navigate('/hr/reports/leaves')}
                        >
                            View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                    </header>
                    <div className="p-4">
                        <ApprovalTable
                            data={pendingLeaves}
                            type="leave"
                            onApprove={handleApproveLeave}
                            onReject={handleRejectLeave}
                            loading={loadingTables}
                        />
                    </div>
                </section>

                {/* Pending Imbursements */}
                <section className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <header className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                            <h3 className="font-bold text-foreground dark:text-foreground">Pending Reimbursements</h3>
                        </div>
                        <button
                            className="text-xs font-semibold text-muted-foreground hover:text-primary uppercase tracking-wide flex items-center gap-1"
                            onClick={() => navigate('/hr/reports/reimbursements')}
                        >
                            View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                    </header>
                    <div className="p-4">
                        <ApprovalTable
                            data={pendingReimbursements}
                            type="reimbursement"
                            onApprove={() => { }}
                            onReject={() => { }}
                            loading={loadingTables}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
