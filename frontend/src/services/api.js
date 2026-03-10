import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // change if needed
// });

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Handle 401 globally (optional but recommended)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;