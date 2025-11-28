import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3500",
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
