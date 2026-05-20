import api from '~/services/api';

export const addDepartment = async (name) => {
  try {
    const response = await api.post('/admin/departments', { name });
    return response.data;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error.response.data;
  }
};

export const getDepartments = async () => {
  try {
    const response = await api.get('/admin/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error.response.data;
  }
};
