import api from "./api";

export const getAttendanceOverview = (filter = "daily") => {
  return api.get(`/admin/attendance/overview?filter=${filter}`);
};

export const getEmployees = () => {
  return api.get("/admin/attendance/employees");
};

export const getDepartments = () => {
  return api.get("/admin/attendance/departments");
};

export const getShifts = () => {
  return api.get("/admin/attendance/shifts");
};

export const getDailyAttendance = () => {
  return api.get("/admin/attendance/daily");
};

export const getMonthlyAttendanceSummary = () => {
  return api.get("/admin/attendance/monthly-summary");
};

export const getAttendanceRegularizationRequests = () => {
  return api.get("/admin/attendance/regularization-requests");
};

export const submitAttendanceRegularizationRequest = (data) => {
  return api.post("/admin/attendance/regularization-requests", data);
};

export const updateAttendanceRegularizationRequest = (id, data) => {
  return api.put(`/admin/attendance/regularization-requests/${id}`, data);
};

export const getOvertimeRecords = () => {
  return api.get("/admin/attendance/overtime-records");
};

export const getAttendancePolicies = () => {
  return api.get("/admin/attendance/policies");
};

export const getAttendanceAuditLogs = () => {
  return api.get("/admin/attendance/audit-logs");
};
