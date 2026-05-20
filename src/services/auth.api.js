import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "An unknown error occurred during login.";
  }
};

export const register = async (name, email, password, role) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "An unknown error occurred during registration.";
  }
};