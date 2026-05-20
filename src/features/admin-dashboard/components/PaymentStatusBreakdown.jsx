import React, { useState, useEffect } from 'react';
import { getPaymentStatusBreakdown } from '~/features/admin-dashboard/services/payment.api';
import PieChartComponent from '~/features/admin-dashboard/components/charts/PieChartComponent';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const PaymentStatusBreakdown = () => {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreakdown = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentStatusBreakdown();
        setBreakdown(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBreakdown();
  }, []);

  if (loading) {
    return (
      <Card
        className="p-6 shadow-md"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Loading payment status breakdown...</p>
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

  const chartData = breakdown ? [
    { name: 'Paid', value: breakdown.paid },
    { name: 'Pending', value: breakdown.pending },
    { name: 'Failed', value: breakdown.failed },
  ] : [];

  return (
    <PieChartComponent
      title="Payment Status Breakdown (Employees)"
      data={chartData}
      dataKey="value"
      nameKey="name"
    />
  );
};

export default PaymentStatusBreakdown;
