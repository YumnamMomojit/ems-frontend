import React, { useState, useEffect } from 'react';
import { getEmployeePaymentRecords, markPaymentAsPaid, retryFailedPayment, addPaymentRemarks, exportPaymentReport } from '~/features/admin-dashboard/services/payment.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { CheckCircle, Repeat, Edit, Download } from 'lucide-react'; // Icons for actions
import { useOrganization } from '~/hooks/OrganizationContext';

const EmployeePaymentTable = () => {
  const { currencySymbol } = useOrganization();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarksInput, setRemarksInput] = useState({}); // State for remarks input fields

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployeePaymentRecords();
      setRecords(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleMarkPaid = async (employeeId) => {
    if (window.confirm(`Mark payment for ${employeeId} as Paid?`)) {
      try {
        await markPaymentAsPaid(employeeId);
        alert('Payment marked as paid successfully!');
        fetchRecords(); // Refresh data
      } catch (err) {
        alert('Failed to mark payment as paid: ' + err.message);
      }
    }
  };

  const handleRetryPayment = async (employeeId) => {
    if (window.confirm(`Retry payment for ${employeeId}?`)) {
      try {
        await retryFailedPayment(employeeId);
        alert('Payment retry initiated successfully!');
        fetchRecords(); // Refresh data
      } catch (err) {
        alert('Failed to retry payment: ' + err.message);
      }
    }
  };

  const handleAddRemarks = async (employeeId) => {
    const remarks = remarksInput[employeeId];
    if (!remarks) {
      alert('Remarks cannot be empty.');
      return;
    }
    if (window.confirm(`Add remarks for ${employeeId}: "${remarks}"?`)) {
      try {
        await addPaymentRemarks(employeeId, remarks);
        alert('Remarks added successfully!');
        setRemarksInput(prev => ({ ...prev, [employeeId]: '' })); // Clear input
        fetchRecords(); // Refresh data
      } catch (err) {
        alert('Failed to add remarks: ' + err.message);
      }
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await exportPaymentReport();
      alert(response.message + (response.downloadLink ? ` Download here: ${response.downloadLink}` : ''));
    } catch (err) {
      alert('Failed to export report: ' + err.message);
    }
  };

  if (loading) {
    return <Card className="p-6 shadow-md"><p>Loading employee payment records...</p></Card>;
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
        <CardTitle className="text-xl font-medium">Employee Payment Records</CardTitle>
        <button
          onClick={handleExportReport}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-normal"
        >
          <Download className="h-4 w-4 mr-2" /> Export Report
        </button>
      </CardHeader>
      <CardContent>
        {records && records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y divide-border"
                style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
              >
                {records.map((record) => (
                  <tr key={record.employeeId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{record.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{record.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{record.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{record.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{currencySymbol}{record.salary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{record.paymentDate || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{record.method}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-900">
                      <input
                        type="text"
                        value={remarksInput[record.employeeId] !== undefined ? remarksInput[record.employeeId] : record.remarks || ''}
                        onChange={(e) => setRemarksInput(prev => ({ ...prev, [record.employeeId]: e.target.value }))}
                        onBlur={() => {
                          if (remarksInput[record.employeeId] !== undefined && remarksInput[record.employeeId] !== record.remarks) {
                            handleAddRemarks(record.employeeId);
                          }
                        }}
                        className="w-full rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm font-normal"
                        style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))' }}
                        placeholder="Add remarks..."
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">
                      {record.status !== 'Paid' && (
                        <button
                          onClick={() => handleMarkPaid(record.employeeId)}
                          className="text-green-600 hover:text-green-900 mr-2"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      {record.status === 'Failed' && (
                        <button
                          onClick={() => handleRetryPayment(record.employeeId)}
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
          <p className="text-sm text-muted-foreground">No employee payment records available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeePaymentTable;
