import api from "./api";

export const getSites = (params = {}) => {
  return api.get("/sites", {
    params,
  });
};

export const getSiteById = (id) => {
  return api.get(`/sites/${id}`);
};

export const createSite = (data) => {
  return api.post("/sites", data);
};

export const updateSite = (id, data) => {
  return api.put(`/sites/${id}`, data);
};

export const deleteSite = (id) => {
  return api.delete(`/sites/${id}`);
};