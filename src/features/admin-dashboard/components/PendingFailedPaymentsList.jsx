import React, { useState, useEffect } from 'react';
import { getPendingFailedPayments, retryFailedPayment } from '~/features/admin-dashboard/services/payment.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { AlertCircle, Repeat } from 'lucide-react';

const PendingFailedPaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingFailedPayments();
      setPayments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRetryPayment = async (employeeId) => {
    if (window.confirm(`Retry payment for ${employeeId}?`)) {
      try {
        await retryFailedPayment(employeeId);
        alert('Payment retry initiated successfully!');
        fetchPayments(); // Refresh data
      } catch (err) {
        alert('Failed to retry payment: ' + err.message);
      }
    }
  };

  if (loading) {
    return <Card className="p-6 shadow-md"><p>Loading pending/failed payments...</p></Card>;
  }

  if (error) {
    return <Card className="p-6 shadow-md text-red-500"><p>Error: {error.message}</p></Card>;
  }

  return (
    <Card
      className="shadow-md"
      style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">Pending & Failed Payments</CardTitle>
        <AlertCircle className="h-5 w-5 text-red-500" />
      </CardHeader>
      <CardContent>
        {payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y divide-border"
                style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
              >
                {payments.map((payment) => (
                  <tr key={payment.employeeId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{payment.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{payment.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{payment.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">
                      {payment.status === 'Failed' && (
                        <button
                          onClick={() => handleRetryPayment(payment.employeeId)}
                          className="text-darkRed hover:text-orange"
                          title="Retry Payment"
                        >
                          <Repeat className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No pending or failed payments.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingFailedPaymentsList;
