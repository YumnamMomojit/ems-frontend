import api from "../../../services/api";

const managerService = {
    getDashboardSummary: async () => {
        const response = await api.get("/manager/summary");
        return response.data;
    },

    getTeamLeaves: async () => {
        const response = await api.get("/manager/leaves");
        return response.data;
    },

    approveLeave: async (id, status) => {
        const response = await api.put(`/manager/leaves/${id}`, { status });
        return response.data;
    },

    getTeamReimbursements: async () => {
        const response = await api.get("/manager/reimbursements");
        return response.data;
    },

    approveReimbursement: async (id, status) => {
        const response = await api.put(`/manager/reimbursements/${id}`, { status });
        return response.data;
    },

    getTeamAttendance: async (date) => {
        const response = await api.get("/manager/attendance", { params: { date } });
        return response.data;
    },

    getTeamWorksheets: async () => {
        const response = await api.get("/manager/worksheets");
        return response.data;
    },

    approveWorksheet: async (id, status, comment) => {
        // Note: status field might not exist in schema yet, will handle gracefully
        const response = await api.put(`/manager/worksheets/${id}`, { status, comment });
        return response.data;
    },

    getTeamAdvances: async () => {
        const response = await api.get("/manager/advances");
        return response.data;
    },

    updateAdvanceStatus: async (id, status) => {
        const response = await api.put(`/manager/advances/${id}`, { status });
        return response.data;
    },

    getTeamPerformance: async () => {
        const response = await api.get("/manager/performance");
        return response.data;
    },

    getTeamDocuments: async () => {
        const response = await api.get("/manager/documents");
        return response.data;
    },

    getTeamMembers: async () => {
        const response = await api.get("/manager/members");
        return response.data;
    },
};

export default managerService;
