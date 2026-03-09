import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/clients", // change if needed
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// CREATE OR UPDATE
export const saveClient = (data) =>
  API.put("/createUpdateClient", data);

// GET ALL
export const fetchAllClients = () =>
  API.get("/getAllClients");

// GET BY ID
export const fetchClientById = (id) =>
  API.get(`/getClientById/${id}`);

// DELETE
export const removeClient = (id) =>
  API.delete(`/deleteClient/${id}`);