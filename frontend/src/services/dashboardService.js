import api from "../services/api";

// GET ALL
export const getLastTenDaysClientDetails = () =>
  api.get("/dashboard/getLastTenDaysClientDetails");

export const getLastTenDeathAnniversaryDetails = () =>
  api.get("/dashboard/getLastTenDeathAnniversaryDetails");

export const getDashboardStats = () =>
  api.get("/dashboard/getDashboardStats");

export const getEventDistribution = () =>
  api.get("/dashboard/getEventDistribution");