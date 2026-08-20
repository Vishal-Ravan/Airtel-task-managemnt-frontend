import api from "./api";

export const getHistory = (params = {}) => {
  return api.get("/history", {
    params,
  });
};

export const getHistoryBySite = (siteId) => {
  return api.get(`/history/site/${siteId}`);
};