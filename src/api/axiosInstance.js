import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const baseURL = isProd
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL;

const API = axios.create({ baseURL });

// Add token automatically if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
