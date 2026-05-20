import React, { useState, useEffect } from 'react';
import { getPayrollSummary } from '~/features/admin-dashboard/services/dashboard.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import KpiCard from '~/features/admin-dashboard/components/cards/KpiCard';
import BarChartComponent from '~/features/admin-dashboard/components/charts/BarChartComponent';
import { DollarSign, Wallet, Hourglass } from 'lucide-react';

const PayrollSummary = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPayrollSummary();
        setPayrollData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Card
        className="p-6 shadow-md"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Loading payroll summary...</p>
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

  const kpiCards = payrollData ? [
    { title: 'Total Payroll This Month', value: `$${payrollData.totalPayroll.toLocaleString()}`, icon: DollarSign, description: 'Gross payroll expense' },
    { title: 'Salaries Processed', value: `$${payrollData.salariesProcessed.toLocaleString()}`, icon: Wallet, description: 'Paid out to employees' },
    { title: 'Pending Payroll', value: `$${payrollData.pendingPayroll.toLocaleString()}`, icon: Hourglass, description: 'Awaiting processing' },
  ] : [];

  return (
    <Card
      className="shadow-md border border-border universal-card-child"
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-wide">Payroll Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {kpiCards.map((card, index) => (
            <KpiCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Payroll Cost</p>
          <div className="text-3xl font-bold text-foreground mt-2">
            ${payrollData.totalPayroll.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-500 font-medium">+2.5%</span> from last month
          </p>
        </div>

        {payrollData.trend && (
          <BarChartComponent
            title="Salary Trend"
            data={payrollData.trend}
            dataKey="month"
            bars={[{ dataKey: 'amount', fill: '#EC1313' }]}
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollSummary;
