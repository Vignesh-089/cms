import api from "../services/api";

export const fetchAllEvents = () =>
  api.get("/events/getAllEventDetails");