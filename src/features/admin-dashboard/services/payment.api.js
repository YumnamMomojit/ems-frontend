import api from '~/services/api';

export const getPaymentSummary = async () => {
  try {
    const response = await api.get('/admin/payments/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    throw error;
  }
};

export const getPaymentStatusBreakdown = async () => {
  try {
    const response = await api.get('/admin/payments/status-breakdown');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment status breakdown:', error);
    throw error;
  }
};

export const getMonthlyPayrollTrend = async () => {
  try {
    const response = await api.get('/admin/payments/monthly-trend');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly payroll trend:', error);
    throw error;
  }
};

export const getDepartmentWisePayroll = async () => {
  try {
    const response = await api.get('/admin/payments/department-wise');
    return response.data;
  } catch (error) {
    console.error('Error fetching department-wise payroll:', error);
    throw error;
  }
};

export const getEmployeePaymentRecords = async () => {
  try {
    const response = await api.get('/admin/payments/records');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee payment records:', error);
    throw error;
  }
};

export const getPendingFailedPayments = async () => {
  try {
    const response = await api.get('/admin/payments/issues');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending/failed payments:', error);
    throw error;
  }
};

export const getPaymentAuditLog = async () => {
  try {
    const response = await api.get('/admin/payments/audit-log');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment audit log:', error);
    throw error;
  }
};

// Admin Actions
export const markPaymentAsPaid = async (employeeId) => {
  try {
    const response = await api.post('/admin/payments/mark-paid', { employeeId });
    return response.data;
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    throw error;
  }
};

export const retryFailedPayment = async (employeeId) => {
  try {
    const response = await api.post('/admin/payments/retry', { employeeId });
    return response.data;
  } catch (error) {
    console.error('Error retrying failed payment:', error);
    throw error;
  }
};

export const addPaymentRemarks = async (employeeId, remarks) => {
  try {
    const response = await api.post('/admin/payments/remarks', { employeeId, remarks });
    return response.data;
  } catch (error) {
    console.error('Error adding payment remarks:', error);
    throw error;
  }
};

export const exportPaymentReport = async () => {
  try {
    const response = await api.get('/admin/payments/export');
    return response.data;
  } catch (error) {
    console.error('Error exporting payment report:', error);
    throw error;
  }
};
