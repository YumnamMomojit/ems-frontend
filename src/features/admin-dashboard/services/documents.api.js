import api from "~/services/api";

export const uploadDocument = async (userId, type, url) => {
  try {
    const response = await api.post("/admin/documents/upload", {
      employeeId: userId,
      type,
      fileUrl: url,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDocuments = async (userId) => {
  try {
    const response = await api.get(`/admin/documents/list/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
