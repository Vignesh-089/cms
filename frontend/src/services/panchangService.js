import api from "../services/api";

export const getPanchangByDate = (date) =>
  api.get(`/panchang/getPanchangByDate?date=${date}`);