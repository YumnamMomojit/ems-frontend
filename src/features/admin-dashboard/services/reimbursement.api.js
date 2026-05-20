import api from "~/services/api";

export const requestReimbursement = async (userId, amount, reason, bill) => {
  try {
    const response = await api.post("/admin/reimbursement/request", {
      userId,
      amount,
      reason,
      bill,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getReimbursementRequests = async () => {
  try {
    const response = await api.get("/admin/reimbursement/list");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const approveReimbursement = async (id, status) => {
  try {
    const response = await api.put(`/admin/reimbursement/approve/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
