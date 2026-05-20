import api from "~/services/api";

export const requestAdvance = async (userId, amount, reason) => {
  try {
    const response = await api.post("/admin/advance/request", {
      userId,
      amount,
      reason,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAdvanceRequests = async () => {
  try {
    const response = await api.get("/admin/advance/list");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const approveAdvance = async (id, status) => {
  try {
    const response = await api.put(`/admin/advance/approve/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
