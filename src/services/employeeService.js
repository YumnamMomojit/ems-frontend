import api from "./api";

const employeeService = {
    // Dashboard
    getDashboardData: async () => {
        const response = await api.get("/employee/dashboard");
        return response.data;
    },

    // Attendance
    clockInOut: async (data) => {
        // data: { action: 'in' | 'out', location: { lat, lng } }
        const response = await api.post("/attendance/clock", data);
        return response.data;
    },

    getAttendanceHistory: async () => {
        const response = await api.get("/employee/attendance-history");
        return response.data;
    },

    // Worksheets
    getWorksheets: async () => {
        const response = await api.get("/employee/worksheets");
        return response.data;
    },

    createWorksheet: async (data) => {
        const response = await api.post("/employee/worksheets", data);
        return response.data;
    },

    // Profile
    getProfile: async () => {
        const response = await api.get("/employee/profile");
        return response.data;
    }
};

export default employeeService;
