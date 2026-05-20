import api from "../../../services/api";

const hrApi = {
    // Dashboard
    getStats: () => api.get("/hr/dashboard-stats"),

    // Attendance
    getAttendance: (params) => api.get("/hr/attendance", { params }),
    getAttendanceStats: (params) => api.get("/hr/attendance/stats", { params }),

    // Reports
    getReportsOverview: (params) => api.get("/hr/reports/overview", { params }),

    // Notifications
    getNotifications: () => api.get("/hr/notifications"),

    // Worksheets
    getWorksheets: () => api.get("/hr/worksheets"),
    getWorksheetStats: () => api.get("/hr/worksheets/stats"),
    getMissingWorksheets: () => api.get("/hr/worksheets/missing"),
    getProjectSummary: () => api.get("/hr/worksheets/project-summary"),
    getWorksheetAnalytics: () => api.get("/hr/worksheets/analytics"),

    // Leaves
    getLeaves: () => api.get("/hr/leaves"),
    getLeaveStats: () => api.get("/hr/leaves/stats"),
    getLeaveCalendar: (params) => api.get("/hr/leaves/calendar", { params }),
    getLeaveBalance: () => api.get("/hr/leaves/balance"),
    getLeaveAnalytics: () => api.get("/hr/leaves/analytics"),
    getLeavePolicy: () => api.get("/hr/leaves/policy"),
    updateLeavePolicy: (data) => api.put("/hr/leaves/policy", data),
    approveLeave: (id, data) => api.post(`/hr/leaves/${id}/approve`, data),
    rejectLeave: (id, data) => api.post(`/hr/leaves/${id}/reject`, data),

    // Reimbursements
    getReimbursements: (params) => api.get("/hr/reimbursements", { params }),
    getReimbursementStats: () => api.get("/hr/reimbursements/stats"),
    approveReimbursement: (id) => api.post(`/hr/reimbursements/${id}/approve`),
    rejectReimbursement: (id, data) => api.post(`/hr/reimbursements/${id}/reject`, data),
    markReimbursementPaid: (id) => api.post(`/hr/reimbursements/${id}/pay`),

    // Advances
    getAdvances: () => api.get("/hr/advances"),
    approveAdvance: (id, data) => api.post(`/hr/advances/${id}/approve`, data),
    rejectAdvance: (id, data) => api.post(`/hr/advances/${id}/reject`, data),
    disburseAdvance: (id) => api.post(`/hr/advances/${id}/disburse`),
    closeAdvance: (id) => api.post(`/hr/advances/${id}/close`),

    // Salary Slips
    getSalarySlips: () => api.get("/hr/salary-slips"),
    uploadSalarySlip: (data) => api.post("/hr/salary-slips/upload", data),

    // Documents
    getDocuments: (params) => api.get("/hr/documents", { params }),
    getDocumentStats: () => api.get("/hr/documents/stats"),
    uploadDocument: (data) => api.post("/hr/documents/upload", data),
    updateDocumentAccess: (id, data) => api.put(`/hr/documents/${id}`, data),
    deleteDocument: (id) => api.delete(`/hr/documents/${id}`),

    // Employee Directory
    getDepartments: () => api.get("/hr/departments"),
    getEmployees: () => api.get("/hr/employees"),
    getEmployeeById: (id) => api.get(`/hr/employees/${id}`),

    // Payroll
    getPayrollStats: (params) => api.get("/hr/payroll/stats", { params }),
    getPayrollCharts: (params) => api.get("/hr/payroll/charts", { params }),
    getPayrollList: (params) => api.get("/hr/payroll/list", { params }),
    getPayrollDetail: (id) => api.get(`/hr/payroll/${id}`),
};

export default hrApi;
