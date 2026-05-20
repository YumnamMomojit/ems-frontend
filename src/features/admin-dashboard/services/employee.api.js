import api from '~/services/api';

export const getEmployeePersonalAttendance = async () => {
  try {
    const response = await api.get('/admin/employees/personal-attendance');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee personal attendance:', error);
    throw error;
  }
};

export const getEmployeeLeaveInfo = async () => {
  try {
    const response = await api.get('/admin/employees/leave-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee leave info:', error);
    throw error;
  }
};

export const getEmployeeSalaryInfo = async () => {
  try {
    const response = await api.get('/admin/employees/salary-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee salary info:', error);
    throw error;
  }
};

export const getEmployeeUpcomingHoliday = async () => {
  try {
    const response = await api.get('/admin/employees/upcoming-holiday');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee upcoming holiday:', error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await api.post('/admin/employees', employeeData);
    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error.response.data;
  }
};

export const getManagers = async () => {
  try {
    const response = await api.get('/admin/employees/managers');
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    throw error;
  }
};
