import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";

// Components
import PayrollHeader from "../components/payroll/PayrollHeader";
import PayrollStats from "../components/payroll/PayrollStats";
import PayrollCharts from "../components/payroll/PayrollCharts";
import PayrollTable from "../components/payroll/PayrollTable";
import PayrollIssues from "../components/payroll/PayrollIssues";
import PayrollDrawer from "../components/payroll/PayrollDrawer";
import { useOrganization } from "~/hooks/OrganizationContext";

const PayrollPage = () => {
    const { currencySymbol } = useOrganization();
    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Data State
    const [stats, setStats] = useState(null);
    const [chartsData, setChartsData] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [issues, setIssues] = useState([]); // Mock issues for now

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear()
            };

            const [statsRes, chartsRes, listRes, missingRes] = await Promise.all([
                hrApi.getPayrollStats(params),
                hrApi.getPayrollCharts(params),
                hrApi.getPayrollList(params),
                hrApi.getMissingWorksheets() // Use this as proxy for issues
            ]);

            setStats(statsRes.data.data);
            setChartsData(chartsRes.data.data);
            setEmployees(listRes.data.data);
            setIssues(missingRes.data.data); // Map missing worksheets to issues

        } catch (error) {
            console.error("Error fetching payroll data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    // Handlers
    const handleEmployeeClick = async (employee) => {
        setSelectedEmployee(employee);
        setIsDrawerOpen(true);

        // Fetch details
        try {
            const res = await hrApi.getPayrollDetail(employee.id);
            setEmployeeDetails(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedEmployee(null);
        setEmployeeDetails(null);
    };

    return (
        <div className="p-8 space-y-8 pb-32"> {/* pb-32 for bottom action bar space */}

            {/* Header */}
            <PayrollHeader
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                status={loading ? "Loading..." : "Draft"} // Mock status for now
            />

            {/* KPI Stats */}
            <PayrollStats stats={stats} loading={loading} />

            {/* Charts */}
            <PayrollCharts data={chartsData} loading={loading} />

            {/* Issues Panel */}
            {issues?.length > 0 && <PayrollIssues issues={issues} />}

            {/* Employee Table */}
            <PayrollTable
                employees={employees}
                loading={loading}
                onRowClick={handleEmployeeClick}
            />

            {/* Detail Drawer */}
            <PayrollDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                employee={selectedEmployee}
                details={employeeDetails}
            />

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40 flex items-center justify-between px-8 shadow-2xl">
                <div className="flex gap-4">
                    <span className="text-sm font-semibold text-muted-foreground">
                        Total Payout: <span className="text-foreground text-lg">
                            {currencySymbol}{(stats?.netPayable || 0).toLocaleString()}
                        </span>
                    </span>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 rounded-lg border border-border font-bold text-sm hover:bg-muted transition-colors">
                        Preview Payroll
                    </button>
                    <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                        Lock & Finalize
                    </button>
                </div>
            </div>

        </div>
    );
};

export default PayrollPage;
