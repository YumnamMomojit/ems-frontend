import React, { useState, useEffect } from 'react';
import { getPaymentAuditLog } from '~/features/admin-dashboard/services/payment.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollText } from 'lucide-react';

const PaymentAuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentAuditLog();
        setAuditLog(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  if (loading) {
    return <Card className="p-6 shadow-md"><p>Loading payment audit log...</p></Card>;
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
        <CardTitle className="text-xl font-medium">Payment Audit Log</CardTitle>
        <ScrollText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {auditLog && auditLog.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody
                className="divide-y divide-border"
                style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
              >
                {auditLog.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{log.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{log.updatedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No audit log entries.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentAuditLog;
