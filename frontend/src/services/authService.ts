import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL
});

// Signup
export const registerUser = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

// Login
export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};
