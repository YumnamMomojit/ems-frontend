import api from "~/services/api";

export const applyLeave = async (userId, type, reason, from, to) => {
  try {
    const response = await api.post("/admin/leaves/apply", {
      userId,
      type,
      reason,
      from,
      to,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLeaveRequests = async () => {
  try {
    const response = await api.get("/admin/leaves/list");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const approveLeave = async (id, status) => {
  try {
    const response = await api.put(`/admin/leaves/approve/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
