import api from "./api";

// Worksheet API calls
export const getEmployeeWorksheets = async (params) => {
  const response = await api.get("/employee/worksheets", { params });
  return response.data;
};

export const getWorksheetSummary = async () => {
  const response = await api.get("/employee/worksheets/dashboard-summary");
  return response.data;
};

export const getActiveProjects = async () => {
  const response = await api.get("/employee/worksheets/projects/active");
  return response.data;
};

export const createEmployeeWorksheet = async (data) => {
  const response = await api.post("/employee/worksheets", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getEmployeeWorksheetById = (id) => {
  return api.get(`/employee/worksheets/${id}`);
};

export const updateEmployeeWorksheet = (id, data) => {
  return api.put(`/employee/worksheets/${id}`, data);
};

export const deleteEmployeeWorksheet = (id) => {
  return api.delete(`/employee/worksheets/${id}`);
};

export const getEmployeeAttendanceHistory = async () => {
  const response = await api.get("/employee/attendance-history");
  return response.data;
};

export const getEmployeeProfile = async () => {
  const response = await api.get("/employee/profile");
  return response.data;
};

export const updateEmployeeProfile = async (data) => {
  const response = await api.put("/employee/profile", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/employee/change-password", data);
  return response.data;
};

// Leaves API
export const getEmployeeLeaves = async () => {
  const response = await api.get("/employee/leaves");
  return response.data;
};

export const applyLeave = async (data) => {
  const response = await api.post("/employee/leaves", data);
  return response.data;
};

// Expenses API
export const getEmployeeExpenses = async () => {
  const response = await api.get("/employee/expenses");
  // Backend returns { data: [], meta: {} }, but we just want the array for the list view
  return response.data.data || response.data;
};

export const createEmployeeExpense = async (data) => {
  // data should be FormData if file upload is involved
  const response = await api.post("/employee/expenses", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Salary API
export const getEmployeeSalary = async (year) => {
  const response = await api.get(`/employee/salary?year=${year}`);
  return response.data;
};

// Documents API
export const getEmployeeDocuments = async () => {
  const response = await api.get("/employee/documents");
  return response.data;
};

export const uploadEmployeeDocument = async (data) => {
  // data should be FormData
  const response = await api.post("/employee/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
