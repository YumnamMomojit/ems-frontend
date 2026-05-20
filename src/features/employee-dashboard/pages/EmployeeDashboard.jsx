import React, { useState, useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  Clock,
  CalendarDays,
  Hourglass,
  CheckSquare,
  Wallet,
  Plane,
} from "lucide-react";
import KpiCard from "../../admin-dashboard/components/cards/KpiCard";
import PieChartComponent from "../../admin-dashboard/components/charts/PieChartComponent";
import {
  getEmployeePersonalAttendance,
  getEmployeeLeaveInfo,
  getEmployeeSalaryInfo,
  getEmployeeUpcomingHoliday,
} from "../../admin-dashboard/services/employee.api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import DashboardWelcome from "~/components/layout/DashboardWelcome";

const EmployeeDashboard = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [upcomingHoliday, setUpcomingHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [attendanceRes, leaveRes, salaryRes, holidayRes] =
          await Promise.all([
            getEmployeePersonalAttendance(),
            getEmployeeLeaveInfo(),
            getEmployeeSalaryInfo(),
            getEmployeeUpcomingHoliday(),
          ]);

        setAttendanceData(attendanceRes);
        setLeaveData(leaveRes);
        setSalaryData(salaryRes);
        setUpcomingHoliday(holidayRes);
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
      <div className="min-h-screen flex items-center justify-center">
        Loading employee dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const leaveBalanceChartData = leaveData
    ? [
      { name: "Used Leave", value: leaveData.takenLeaves },
      {
        name: "Remaining Leave",
        value: leaveData.totalLeaves - leaveData.takenLeaves,
      },
    ]
    : [];

  return (
    <div className="universal-card-parent">
      <DashboardWelcome />

      {/* Personal Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {attendanceData && (
          <KpiCard
            title="Total Hours This Week"
            value={`${attendanceData.totalHoursThisWeek} Hrs`}
            icon={Clock}
            description={`On-time: ${attendanceData.onTimeArrivals}, Late: ${attendanceData.lateArrivals}`}
          />
        )}
        {leaveData && (
          <KpiCard
            title="My Leave Balance"
            value={`${leaveData.totalLeaves - leaveData.takenLeaves} Days`}
            icon={Briefcase}
            description={`Pending: ${leaveData.pendingRequests}, Taken: ${leaveData.takenLeaves}`}
          />
        )}
        {salaryData && (
          <KpiCard
            title="Next Payroll"
            value={`$${salaryData.netSalary.toLocaleString()}`}
            icon={DollarSign}
            description={`Due: ${format(new Date(salaryData.nextPaymentDate), "MMM dd, yyyy")}`}
          />
        )}
        {upcomingHoliday && (
          <KpiCard
            title="Upcoming Holiday"
            value={upcomingHoliday.name}
            icon={CalendarDays}
            description={`Date: ${format(new Date(upcomingHoliday.date), "MMM dd, yyyy")}`}
          />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {leaveData && (
          <PieChartComponent
            title="Leave Balance Overview"
            data={leaveBalanceChartData}
            dataKey="value"
            nameKey="name"
            className="flex justify-center items-center"
          />
        )}
        {/* Additional employee-specific charts or content can go here */}
      </div>

      {/* My Salary Details */}
      {salaryData && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card className="shadow-md universal-card-child">
            <CardHeader>
              <CardTitle className="text-xl font-medium">
                My Salary Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                  title="Base Salary"
                  value={`$${salaryData.baseSalary.toLocaleString()}`}
                  icon={Briefcase}
                />
                <KpiCard
                  title="Allowances"
                  value={`$${salaryData.allowances.toLocaleString()}`}
                  icon={Wallet}
                />
                <KpiCard
                  title="Deductions"
                  value={`$${salaryData.deductions.toLocaleString()}`}
                  icon={Plane}
                />
                <KpiCard
                  title="Net Salary"
                  value={`$${salaryData.netSalary.toLocaleString()}`}
                  icon={DollarSign}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* More dashboard content will go here */}
    </div>
  );
};

export default EmployeeDashboard;
