import axios from "axios";
import { getSession, clearSession } from "./session";

// The only axios setup in the project. Every service uses it.
const api = axios.create({ baseURL: "/api" });

// attach the login token to every request
api.interceptors.request.use((config) => {
  const s = getSession();
  if (s?.token && !s.demo) {
    config.headers = config.headers || {};
    config.headers.Authorization = "Bearer " + s.token;
  }
  return config;
});

// if the token expired, go back to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined" && getSession()) {
      clearSession();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;
