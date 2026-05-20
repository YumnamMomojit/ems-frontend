import React from 'react';
import PaymentSummaryCards from '~/features/admin-dashboard/components/PaymentSummaryCards';
import PaymentStatusBreakdown from '~/features/admin-dashboard/components/PaymentStatusBreakdown';
import MonthlyPayrollTrendChart from '~/features/admin-dashboard/components/MonthlyPayrollTrendChart';
import DepartmentWisePayrollTable from '~/features/admin-dashboard/components/DepartmentWisePayrollTable';
import EmployeePaymentTable from '~/features/admin-dashboard/components/EmployeePaymentTable';
import PendingFailedPaymentsList from '~/features/admin-dashboard/components/PendingFailedPaymentsList';
import PaymentAuditLog from '~/features/admin-dashboard/components/PaymentAuditLog';
import { Card } from '~/components/ui/card'; // Import Card for consistent styling

const PayrollPage = () => {
  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
    >
      <h1 className="text-3xl font-medium text-foreground mb-6">Admin Payment Section</h1>

      {/* 1. Payment Summary */}
      <div className="mb-8">
        <PaymentSummaryCards />
      </div>

      {/* 2. Payment Status Breakdown | 3. Monthly Payroll Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card
          className="p-6 shadow-md"
          style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
        >
          <PaymentStatusBreakdown />
        </Card>
        <Card
          className="p-6 shadow-md"
          style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
        >
          <MonthlyPayrollTrendChart />
        </Card>
      </div>

      {/* 4. Department-Wise Payroll */}
      <div className="mb-8">
        <DepartmentWisePayrollTable />
      </div>

      {/* 5. Employee Payment Table (Core Section) */}
      <div className="mb-8">
        <EmployeePaymentTable />
      </div>

      {/* 6. Pending & Failed Payments Focus */}
      <div className="mb-8">
        <PendingFailedPaymentsList />
      </div>

      {/* 8. Audit & Payment History */}
      <div className="mb-8">
        <PaymentAuditLog />
      </div>
    </div>
  );
};

export default PayrollPage;