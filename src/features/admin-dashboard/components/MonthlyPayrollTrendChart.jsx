import React, { useState, useEffect } from 'react';
import { getMonthlyPayrollTrend } from '~/features/admin-dashboard/services/payment.api';
import BarChartComponent from '~/features/admin-dashboard/components/charts/BarChartComponent';
import { Card } from '~/components/ui/card';

const MonthlyPayrollTrendChart = () => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrend = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMonthlyPayrollTrend();
        setTrendData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, []);

  if (loading) {
    return (
      <Card
        className="p-6 shadow-md"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Loading monthly payroll trend...</p>
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

  const bars = [
    { dataKey: 'paid', fill: '#82ca9d', name: 'Paid' },
    { dataKey: 'pending', fill: '#ffc658', name: 'Pending' },
  ];

  return (
    <BarChartComponent
      title="Monthly Payroll Trend"
      data={trendData}
      dataKey="month"
      bars={bars}
    />
  );
};

export default MonthlyPayrollTrendChart;
