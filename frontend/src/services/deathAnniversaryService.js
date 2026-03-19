// services/deathAnniversaryService.js
import api from "./api";

// CALCULATE DEATH ANNIVERSARY
export const calculateDeathAnniversary = (data) =>
  api.post("/death-anniversary/calculate", data);

// FETCH ANNIVERSARY HISTORY
export const fetchDeathAnniversaryHistory = (data) =>
  api.post("/death-anniversary/history", data);

// SAVE DEATH ANNIVERSARY AS CLIENT
export const saveDeathAnniversary = (data) =>
  api.post("/death-anniversary/save", data);