import React, { useState, useEffect } from 'react';
import { getPaymentSummary } from '~/features/admin-dashboard/services/payment.api';
import KpiCard from '~/features/admin-dashboard/components/cards/KpiCard';
import { DollarSign, Wallet, Hourglass, XCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useOrganization } from '~/hooks/OrganizationContext';

const PaymentSummaryCards = () => {
  const { currencySymbol } = useOrganization();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentSummary();
        setSummary(data);
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
        <p>Loading payment summary...</p>
      </Card>
    );
  }

  if (error) {
    return <Card className="p-6 shadow-md text-red-500"><p>Error: {error.message}</p></Card>;
  }

  const kpiCards = summary ? [
    { title: 'Total Payroll (Current Month)', value: `${currencySymbol}${summary.totalPayroll.toLocaleString()}`, icon: DollarSign, description: 'Gross payroll expense' },
    { title: 'Total Paid Amount', value: `${currencySymbol}${summary.totalPaid.toLocaleString()}`, icon: Wallet, description: 'Amount disbursed' },
    { title: 'Pending Amount', value: `${currencySymbol}${summary.pendingAmount.toLocaleString()}`, icon: Hourglass, description: 'Awaiting processing' },
    { title: 'Failed / On-Hold Amount', value: `${currencySymbol}${summary.failedAmount.toLocaleString()}`, icon: XCircle, description: 'Requires attention' },
    { title: 'Employees Paid Count', value: summary.employeesPaid, icon: Users, description: 'Number of employees paid' },
  ] : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
  );
};

export default PaymentSummaryCards;
