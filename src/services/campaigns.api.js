import api from "./api";


// GET ALL CAMPAIGNS

export const getCampaigns = (
  params = {}
) => {
  return api.get("/campaigns", {
    params,
  });
};


// GET CAMPAIGN

export const getCampaignById = (
  id
) => {
  return api.get(
    `/campaigns/${id}`
  );
};


// CREATE

export const createCampaign = (
  data
) => {
  return api.post(
    "/campaigns",
    data
  );
};


// UPDATE

export const updateCampaign = (
  id,
  data
) => {
  return api.put(
    `/campaigns/${id}`,
    data
  );
};


// UPDATE STATUS

export const updateCampaignStatus = (
  id,
  data
) => {
  return api.patch(
    `/campaigns/${id}/status`,
    data
  );
};


// DELETE

export const deleteCampaign = (
  id
) => {
  return api.delete(
    `/campaigns/${id}`
  );
};