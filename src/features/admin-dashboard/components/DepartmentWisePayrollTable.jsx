import React, { useState, useEffect } from 'react';
import { getDepartmentWisePayroll } from '~/features/admin-dashboard/services/payment.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useOrganization } from '~/hooks/OrganizationContext';

const DepartmentWisePayrollTable = () => {
  const { currencySymbol } = useOrganization();
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDepartmentWisePayroll();
        setPayrollData(data);
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
      <Card
        className="p-6 shadow-md"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Loading department-wise payroll...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className="p-6 shadow-md text-red-500"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Error: {error.message}</p>
      </Card>
    );
  }

  return (
    <Card
      className="shadow-md"
      style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium">Department-Wise Payroll</CardTitle>
      </CardHeader>
      <CardContent>
        {payrollData && payrollData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Payroll Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employees</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: 'hsl(var(--card))' }}
                className="divide-y divide-border"
              >
                {payrollData.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal" style={{ color: 'hsl(var(--foreground))' }}>{record.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal" style={{ color: 'hsl(var(--foreground))' }}>{currencySymbol}{record.payroll.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal" style={{ color: 'hsl(var(--foreground))' }}>{record.employees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No department-wise payroll data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentWisePayrollTable;
