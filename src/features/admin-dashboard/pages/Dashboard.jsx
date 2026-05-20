import React, { useState, useEffect } from "react";
import { getDashboardStats } from "~/features/admin-dashboard/services/dashboard.api";
import AdminStats from "~/features/admin-dashboard/components/dashboard-widgets/AdminStats";
import AlertsPanel from "~/features/admin-dashboard/components/dashboard-widgets/AlertsPanel";
import QuickActions from "~/features/admin-dashboard/components/dashboard-widgets/QuickActions";
import PayrollOverview from "~/features/admin-dashboard/components/dashboard-widgets/PayrollOverview";
import RecentActivityFeed from "~/features/admin-dashboard/components/dashboard-widgets/RecentActivityFeed";
import DashboardWelcome from "~/components/layout/DashboardWelcome";
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
  Cell
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  // Add null safety
  const safeStats = stats || { kpi: {}, analytics: { attendanceTrend: [], statusBreakdown: [] }, alerts: [], activities: [] };

  // Chart Data Preparation
  const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Amber, Red

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen font-sans text-foreground">
      <DashboardWelcome />

      {/* SECTION 1: KPI CARDS */}
      <AdminStats stats={safeStats.kpi || {}} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SECTION 2: ANALYTICS (Charts) - SPANS 2 COLUMNS */}
        <div className="lg:col-span-2 space-y-6">

          {/* Attendance Trend */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="font-bold text-card-foreground mb-6">Monthly Attendance Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeStats.analytics?.attendanceTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).getDate()}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--card-foreground))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Ratio */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h3 className="font-bold text-card-foreground mb-4">Leave vs Present Ratio</h3>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: safeStats.analytics?.leaveRatio?.present || 0 },
                        { name: 'On Leave', value: safeStats.analytics?.leaveRatio?.leave || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {/* Present (Green), Leave (Amber) */}
                      <Cell key="cell-0" fill="#10B981" />
                      <Cell key="cell-1" fill="#F59E0B" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--card-foreground))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-muted-foreground">On Leave</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <QuickActions />
          </div>

        </div>

        {/* RIGHT COLUMN - ALERTS & ACTIVITY */}
        <div className="space-y-6">
          {/* SECTION 3: ALERTS */}
          <div className="h-auto">
            <AlertsPanel alerts={safeStats.alerts || []} />
          </div>

          {/* Payroll Snapshot */}
          <div className="h-auto">
            <PayrollOverview finance={safeStats.analytics?.finance || {}} payroll={safeStats.kpi?.payroll || {}} />
          </div>

          {/* SECTION 5: ACTIVITY FEED */}
          <div className="h-auto">
            <RecentActivityFeed activities={safeStats.recentActivity || []} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
