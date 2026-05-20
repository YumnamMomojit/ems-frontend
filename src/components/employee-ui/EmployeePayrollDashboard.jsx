import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EmployeePayrollDashboard = () => {
  const [payrollPreview, setPayrollPreview] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      
      // Load payroll preview
      const previewRes = await api.get('/admin/payroll/preview');
      setPayrollPreview(previewRes.data.payroll);

      // Load payroll history
      const historyRes = await api.get('/admin/payroll/history');
      setPayrollHistory(historyRes.data.payrolls);
    } catch (error) {
      console.error('Failed to load payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSalarySlip = async (month, year) => {
    try {
      setDownloading(true);
      const response = await api.get('/admin/payroll/download-slip', {
        params: { month, year },
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary_slip_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download salary slip:', error);
      alert('Failed to download salary slip');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Payroll Dashboard</h1>
        <p className="mt-2 text-blue-100">View your salary details and download payslips</p>
      </div>

      {/* Current Month Preview */}
      {payrollPreview && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Current Month Salary Preview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Gross Salary</p>
              <p className="text-2xl font-bold text-green-700">
                ₹ {payrollPreview.grossSalary.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Total Deductions</p>
              <p className="text-2xl font-bold text-red-700">
                ₹ {payrollPreview.totalDeductions.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Net Payable</p>
              <p className="text-2xl font-bold text-blue-700">
                ₹ {payrollPreview.netPayable.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Earnings</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Basic Pay</span>
                  <span className="font-medium">₹ {payrollPreview.earnings.basicPay?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">HRA</span>
                  <span className="font-medium">₹ {payrollPreview.earnings.hra?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Conveyance</span>
                  <span className="font-medium">₹ {payrollPreview.earnings.conveyance?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Special Allowance</span>
                  <span className="font-medium">₹ {payrollPreview.earnings.specialAllowance?.toLocaleString('en-IN')}</span>
                </div>
                {payrollPreview.earnings.overtimePay > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Overtime Pay</span>
                    <span className="font-medium">₹ {payrollPreview.earnings.overtimePay?.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Deductions</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Provident Fund (PF)</span>
                  <span className="font-medium">₹ {payrollPreview.deductionBreakdown.pf?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">ESI</span>
                  <span className="font-medium">₹ {payrollPreview.deductionBreakdown.esi?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Professional Tax</span>
                  <span className="font-medium">₹ {payrollPreview.deductionBreakdown.pt?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Income Tax (TDS)</span>
                  <span className="font-medium">₹ {payrollPreview.deductionBreakdown.tds?.toLocaleString('en-IN')}</span>
                </div>
                {payrollPreview.deductionBreakdown.lateDeduction > 0 && (
                  <div className="flex justify-between py-2 border-b text-red-600">
                    <span>Late Penalty</span>
                    <span className="font-medium">₹ {payrollPreview.deductionBreakdown.lateDeduction?.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Attendance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{payrollPreview.workingDays}</p>
                <p className="text-sm text-gray-600">Working Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{payrollPreview.presentDays}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{payrollPreview.lateDays}</p>
                <p className="text-sm text-gray-600">Late Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{payrollPreview.overtimeHours.toFixed(1)}</p>
                <p className="text-sm text-gray-600">OT Hours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Salary History</h2>
        
        {payrollHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payroll history available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month/Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollHistory.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹ {payroll.grossSalary?.toLocaleString('en-IN') || payroll.basicPay?.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">
                        ₹ {payroll.totalDeductions?.toLocaleString('en-IN') || payroll.deductions?.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        ₹ {payroll.netPayable?.toLocaleString('en-IN') || payroll.netPay?.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payroll.status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payroll.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => downloadSalarySlip(payroll.month, payroll.year)}
                        disabled={downloading}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      >
                        {downloading ? 'Downloading...' : 'Download PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayrollDashboard;
