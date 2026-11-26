import api from "./api";

export const loginWithGoogle = () => {
  window.location.assign(`${api.defaults.baseURL}/auth/google`);
};

export const loginWithGitHub = () => {
  window.location.assign(`${api.defaults.baseURL}/auth/github`);
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
