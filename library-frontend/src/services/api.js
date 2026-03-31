import axios from "axios";

// Vite replaces `import.meta.env.*` at build time.
// Set `VITE_API_BASE_URL` in Render (e.g. https://library-management-backend.onrender.com).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;