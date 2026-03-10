import api from "../services/api";

// CREATE OR UPDATE
export const saveClient = (data) =>
  api.put("/clients/createUpdateClient", data);

// GET ALL
export const fetchAllClients = () =>
  api.get("/clients/getAllClients");

// GET BY ID
export const fetchClientById = (id) =>
  api.get(`/clients/getClientById/${id}`);

// DELETE
export const removeClient = (id) =>
  api.delete(`/clients/deleteClient/${id}`);