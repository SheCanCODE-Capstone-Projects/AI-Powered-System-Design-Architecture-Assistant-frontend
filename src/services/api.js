
import axios from "axios";

const config = {
  baseURL: process.env.REACT_APP_API_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

const api = axios.create(config);
const refreshApi = axios.create(config);

let isRefreshing = false;
let queue = [];

function processQueue(error, token) {
  queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  queue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const request = error.config;

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      request.url?.includes("/auth/refresh") ||
      request.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        request.headers.Authorization = `Bearer ${token}`;
        return api(request);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await refreshApi.post("/auth/refresh");
      const token = data?.accessToken;

      if (!token) throw new Error("No access token received");

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      processQueue(null, token);

      request.headers.Authorization = `Bearer ${token}`;
      return api(request);
    } catch (refreshError) {
      processQueue(refreshError);
      delete api.defaults.headers.common.Authorization;
      window.dispatchEvent(new Event("auth:session-expired"));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
