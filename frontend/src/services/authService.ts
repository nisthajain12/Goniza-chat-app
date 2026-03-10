import axios from "axios";



// axios instance
export const api = axios.create({
  baseURL: "https://goniza-chat-app-hnvc.vercel.app/api"
});

// attaching token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// signup request
export const registerUser = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

// login request
export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};