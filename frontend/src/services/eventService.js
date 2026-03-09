import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api/events", // change if needed
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllEvents = (data) =>
  API.get("/getAllEventDetails", data);