import React, { useState, useMemo } from "react";
import { useAuth } from "~/hooks/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api"; // Centralized API instance
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCcw,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, subDays } from "date-fns";
import KpiCard from "../../admin-dashboard/components/cards/KpiCard";
import PieChartComponent from "../../admin-dashboard/components/charts/PieChartComponent";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/employee-ui/select";
import { Input } from "~/components/employee-ui/input";
import { Button } from "~/components/employee-ui/button";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/employee-ui/popover";
import { Calendar } from "~/components/employee-ui/calendar"; // Assuming calendar component exists
import { cn } from "~/utils/utils"; // Assuming cn utility for classNames exists

const AdminAttendancePage = () => {
  const { user } = useAuth();
  const [selectedSelfie, setSelectedSelfie] = useState(null);

  // State for filters
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("all");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [dateFilterType, setDateFilterType] = useState("daily"); // 'daily', 'weekly', 'monthly', 'custom'

  // --- Fetching Data ---

  // Fetch Employees for filter dropdown
  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["adminEmployees"],
    queryFn: async () => {
      const response = await api.get("/admin/attendance/employees");
      return response.data;
    },
  });

  // Fetch Departments for filter dropdown
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["adminDepartments"],
    queryFn: async () => {
      const response = await api.get("/admin/attendance/departments");
      return response.data;
    },
  });

  // Calculate formatted date strings for API call based on dateRange and dateFilterType
  const formattedStartDate = useMemo(() => {
    if (!dateRange.from) return undefined;
    return format(dateRange.from, "yyyy-MM-dd");
  }, [dateRange.from]);

  const formattedEndDate = useMemo(() => {
    if (!dateRange.to) return undefined;
    return format(dateRange.to, "yyyy-MM-dd");
  }, [dateRange.to]);

  // Fetch Attendance Records
  const { data: attendanceRecords, isLoading: isLoadingAttendanceRecords, refetch: refetchAttendanceRecords } = useQuery({
    queryKey: [
      "adminAttendanceList",
      selectedEmployeeId,
      selectedDepartmentId,
      formattedStartDate,
      formattedEndDate,
    ],
    queryFn: async () => {
      const params = {
        employeeId: selectedEmployeeId === "all" ? undefined : selectedEmployeeId,
        departmentId: selectedDepartmentId === "all" ? undefined : selectedDepartmentId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
      const response = await api.get("/admin/attendance", { params }); // GET /api/admin/attendance
      return response.data;
    },
    select: (data) => {
      // Sort by date (desc) and then punchInTime (desc)
      return data.sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
        const punchInA = a.punchInTime ? parseISO(a.punchInTime).getTime() : 0;
        const punchInB = b.punchInTime ? parseISO(b.punchInTime).getTime() : 0;
        return punchInB - punchInA;
      });
    }
  });

  // Fetch Attendance Overview (for KPI cards)
  const { data: attendanceOverview, isLoading: isLoadingAttendanceOverview } = useQuery({
    queryKey: ["adminAttendanceOverview", dateFilterType, formattedStartDate], // Overview is typically for a specific period
    queryFn: async () => {
      const response = await api.get("/admin/attendance/overview", {
        params: {
          filter: dateFilterType === "custom" ? "daily" : dateFilterType, // Backend overview expects daily/weekly/monthly filter
          date: formattedStartDate, // Use start date for overview context
        },
      });
      return response.data;
    },
  });

  // --- Date Navigation Handlers ---
  const handleDateChange = (date) => {
    setDateRange({ from: date, to: date });
    setDateFilterType("daily");
  };

  const handlePrevDay = () => {
    setDateRange((prev) => ({
      from: subDays(prev.from, 1),
      to: subDays(prev.to, 1),
    }));
    setDateFilterType("daily");
  };

  const handleNextDay = () => {
    setDateRange((prev) => ({
      from: addDays(prev.from, 1),
      to: addDays(prev.to, 1),
    }));
    setDateFilterType("daily");
  };

  const handleDateFilterTypeChange = (value) => {
    setDateFilterType(value);
    const today = new Date();
    let from = today;
    let to = today;

    if (value === "weekly") {
      from = startOfWeek(today);
      to = endOfWeek(today);
    } else if (value === "monthly") {
      from = startOfMonth(today);
      to = endOfMonth(today);
    } // 'daily' is default, 'custom' relies on dateRange state

    setDateRange({ from, to });
  };


  const isLoading = isLoadingAttendanceRecords || isLoadingEmployees || isLoadingDepartments || isLoadingAttendanceOverview;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="universal-card-parent max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Attendance Management</h1>

      {/* Date Navigation & Filters */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-lg shadow-sm universal-card-child"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, "PPP") : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from) {
                    setDateRange({ from: range.from, to: range.to || range.from });
                    setDateFilterType("custom");
                  }
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleDateFilterTypeChange("daily")}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        <Select value={dateFilterType} onValueChange={handleDateFilterTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees?.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} ({employee.employeeCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments?.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      {attendanceOverview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard
            title="Total Employees"
            value={attendanceOverview.totalEmployees}
            icon={Users}
            description="Overall registered employees"
          />
          <KpiCard
            title="Total Present Today"
            value={attendanceOverview.present}
            icon={UserCheck}
            description="Employees who have punched in today"
          />
          <KpiCard
            title="Total Absent Today"
            value={attendanceOverview.absent}
            icon={UserX}
            description="Employees who have not punched in today"
          />
        </div>
      )}

      <div
        className="p-6 rounded-lg shadow-md universal-card-child"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Attendance Records
          </h2>
        </div>
        {attendanceRecords?.length === 0 ? (
          <p className="text-muted-foreground">No attendance records found for the selected criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Employee ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Employee Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Punch In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Punch Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Total Hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Selfie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {attendanceRecords?.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {record.employee?.employeeCode || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {record.employee?.department?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {record.date ? format(parseISO(record.date), "PPP") : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {record.punchInTime ? format(parseISO(record.punchInTime), "p") : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {record.punchOutTime ? format(parseISO(record.punchOutTime), "p") : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {record.hoursWorked ? `${record.hoursWorked} hrs` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {record.status || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {record.selfieUrl ? (
                        <button
                          onClick={() => setSelectedSelfie(record.selfieUrl)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-xs">View</span>
                        </button>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selfie Preview Modal */}
      {selectedSelfie && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSelfie(null)}>
          <div className="relative max-w-2xl w-full bg-card rounded-xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSelfie(null)}
              className="absolute top-4 right-4 p-2 bg-muted hover:bg-muted/80 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Selfie</h3>
            <div className="rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedSelfie}
                alt="Attendance Selfie"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendancePage;