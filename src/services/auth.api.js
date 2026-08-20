import api from "./api";

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);

// export const resetPassword = (data) =>
//   api.post("/auth/reset-password", data);

export const changePassword = (data) =>
  api.post("/auth/change-password", data);

export const verifyEmail = (token) =>
  api.get(`/auth/verify-email/${token}`);



export const resetPassword = (
  token,
  data
) => {
  return api.post(
    `/auth/reset-password/${token}`,
    data
  );
};