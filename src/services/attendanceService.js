import api from "./api";

const attendanceService = {
    // Punch In
    punchIn: async (location) => {
        const response = await api.post("/employee/attendance/punch-in", { location });
        return response.data;
    },

    // Punch Out
    punchOut: async (location) => {
        const response = await api.post("/employee/attendance/punch-out", { location });
        return response.data;
    },

    // Get Today's Status
    getTodayAttendance: async () => {
        const response = await api.get("/employee/attendance/today");
        return response.data;
    },

    // Get History
    getAttendanceHistory: async (month, year) => {
        const response = await api.get("/employee/attendance/history", {
            params: { month, year }
        });
        return response.data;
    },

    // Get Monthly Summary
    getMonthlySummary: async (month, year) => {
        const response = await api.get("/employee/attendance/summary", {
            params: { month, year }
        });
        return response.data;
    }
};

export default attendanceService;
