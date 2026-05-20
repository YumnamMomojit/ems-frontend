import React, { useState, useMemo } from 'react';
import { useAuth } from '~/hooks/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { format, parseISO, startOfDay, endOfDay, addDays, subDays } from 'date-fns'; // Changed date-fns imports
import {
  Users,
  Hourglass,
  CheckCircle,
  XCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ListFilter,
  Briefcase,
  Clock,
  User
} from 'lucide-react';
import KpiCard from '../../admin-dashboard/components/cards/KpiCard';
import BarChartComponent from '../../admin-dashboard/components/charts/BarChartComponent'; // Added import
import PieChartComponent from '../../admin-dashboard/components/charts/PieChartComponent'; // Added import
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'; // Added import
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/employee-ui/select';
import { Input } from '~/components/employee-ui/input';
import { Button } from '~/components/employee-ui/button';
import { Skeleton } from '~/components/employee-ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/employee-ui/popover';
import { Calendar } from '~/components/employee-ui/calendar';
import { cn } from '~/utils/utils';

const AdminWorksheetPage = () => {
  const { user } = useAuth();

  // State for filters
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(), // Initialize to current day
    to: new Date(),   // Initialize to current day
  });
  const [selectedStatus, setSelectedStatus] = useState('all'); // Assuming worksheet can have statuses like 'PENDING', 'APPROVED'


  // Fetch Employees for filter dropdown
  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['adminEmployeesForWorksheet'],
    queryFn: async () => {
      const response = await api.get('/admin/attendance/employees'); // Reusing the employee list endpoint
      return response.data;
    },
  });

  // Calculate formatted date strings for API call based on dateRange
  const formattedStartDate = useMemo(() => {
    if (!dateRange.from) return undefined;
    return format(dateRange.from, 'yyyy-MM-dd');
  }, [dateRange.from]);

  const formattedEndDate = useMemo(() => {
    if (!dateRange.to) return undefined;
    return format(dateRange.to, 'yyyy-MM-dd');
  }, [dateRange.to]);

  // Fetch Worksheets
  const { data: worksheets, isLoading: isLoadingWorksheets, refetch: refetchWorksheets } = useQuery({
    queryKey: ['adminWorksheets', selectedEmployeeId, formattedStartDate, formattedEndDate, selectedStatus],
    queryFn: async () => {
      const params = {
        employeeId: selectedEmployeeId === 'all' ? undefined : selectedEmployeeId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
      };
      const response = await api.get('/admin/worksheet', { params });
      return response.data;
    },
    select: (data) => {
      return data.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    },
  });

  // Derived Summary Data for KPI Cards
  const totalWorksheets = worksheets?.length || 0;
  const pendingWorksheets = worksheets?.filter(ws => ws.status === 'PENDING').length || 0; // Assuming a 'status' field
  const approvedWorksheets = worksheets?.filter(ws => ws.status === 'APPROVED').length || 0; // Assuming a 'status' field
  const totalHoursSubmitted = worksheets?.reduce((sum, ws) => sum + (ws.totalHours || 0), 0) || 0;

  // Derived Chart Data
  const worksheetsByEmployeeChartData = useMemo(() => {
    if (!worksheets) return [];
    const employeeMap = new Map();
    worksheets.forEach(ws => {
      const employeeName = ws.employee ? `${ws.employee.firstName} ${ws.employee.lastName}` : 'Unknown Employee';
      employeeMap.set(employeeName, (employeeMap.get(employeeName) || 0) + 1);
    });
    return Array.from(employeeMap, ([name, count]) => ({ name, count }));
  }, [worksheets]);

  const hoursPerProjectChartData = useMemo(() => {
    if (!worksheets) return [];
    const projectHoursMap = new Map();
    worksheets.forEach(ws => {
      const projectName = ws.project || 'Unknown Project';
      projectHoursMap.set(projectName, (projectHoursMap.get(projectName) || 0) + (ws.totalHours || 0));
    });
    return Array.from(projectHoursMap, ([name, hours]) => ({ name, hours }));
  }, [worksheets]);


  // --- Date Navigation Handlers (now day-based) ---
  const handlePrevDay = () => {
    setDateRange((prev) => ({
      from: subDays(prev.from, 1),
      to: subDays(prev.to, 1),
    }));
  };

  const handleNextDay = () => {
    setDateRange((prev) => ({
      from: addDays(prev.from, 1),
      to: addDays(prev.to, 1),
    }));
  };

  const handleResetDay = () => {
    setDateRange({
      from: new Date(),
      to: new Date(),
    });
  };

  const isLoading = isLoadingWorksheets || isLoadingEmployees;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="universal-card-parent max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Worksheet Management</h1>

      {/* Filters and Date Navigation */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-lg shadow-sm universal-card-child"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay}> {/* Changed to handlePrevDay */}
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[200px] justify-start text-left font-normal',
                  !dateRange.from && 'text-muted-foreground'
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, 'PPP') : <span>Pick a date</span>} {/* Changed format to PPP */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card" align="start">
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={dateRange.from}
                selected={dateRange.from}
                onSelect={(date) => {
                  if (date) {
                    setDateRange({ from: date, to: date }); // Update to single day
                  }
                }}
                numberOfMonths={1}
                fromYear={2020}
                toYear={new Date().getFullYear() + 5}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleNextDay}> {/* Changed to handleNextDay */}
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetDay}> {/* Changed to handleResetDay */}
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

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

        {/* Assuming a status field for worksheets */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem> {/* Default status after submission */}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Worksheets"
          value={totalWorksheets}
          icon={Users}
          description="Number of worksheets submitted"
        />
        <KpiCard
          title="Total Hours Submitted"
          value={`${totalHoursSubmitted.toFixed(1)} hrs`}
          icon={Clock}
          description="Total hours across all worksheets"
        />
        <KpiCard
          title="Pending Review"
          value={pendingWorksheets}
          icon={Hourglass}
          description="Worksheets awaiting approval"
        />
        <KpiCard
          title="Approved Worksheets"
          value={approvedWorksheets}
          icon={CheckCircle}
          description="Worksheets that have been approved"
        />
      </div>

      {/* Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="universal-card-child">
          <CardHeader><CardTitle>Worksheets by Employee</CardTitle></CardHeader>
          <CardContent className="h-[300px]"> {/* Added height for chart */}
            {worksheetsByEmployeeChartData.length > 0 ? (
              <BarChartComponent data={worksheetsByEmployeeChartData} dataKey="name" valueKey="count" />
            ) : (
              <p className="text-muted-foreground text-center py-10">No data for this chart.</p>
            )}
          </CardContent>
        </Card>
        <Card className="universal-card-child">
          <CardHeader><CardTitle>Hours per Project</CardTitle></CardHeader>
          <CardContent className="h-[300px]"> {/* Added height for chart */}
            {hoursPerProjectChartData.length > 0 ? (
              <PieChartComponent data={hoursPerProjectChartData} dataKey="hours" nameKey="name" />
            ) : (
              <p className="text-muted-foreground text-center py-10">No data for this chart.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Worksheets Table */}
      <div
        className="p-6 rounded-lg shadow-md universal-card-child"
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Detailed Worksheet Entries</h2>
        {worksheets?.length === 0 ? (
          <p className="text-muted-foreground">No worksheet records found for the selected criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tasks Done
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }} className="divide-y divide-border">
                {worksheets?.map((ws) => (
                  <tr key={ws.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {format(parseISO(ws.date), 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {ws.employee ? `${ws.employee.firstName} ${ws.employee.lastName}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {ws.project}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {ws.tasksDone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {ws.totalHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {ws.status || 'SUBMITTED'} {/* Default status */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {ws.submittedAt ? format(parseISO(ws.submittedAt), 'Pp') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorksheetPage;