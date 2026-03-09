import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/dashboard", // change if needed
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET ALL
export const getLastTenDaysClientDetails = () =>
  API.get("/getLastTenDaysClientDetails");

export const getLastTenDeathAnniversaryDetails = () =>
  API.get("/getLastTenDeathAnniversaryDetails");

export const getDashboardStats = () =>
  API.get("/getDashboardStats");

export const getEventDistribution = () =>
  API.get("/getEventDistribution");