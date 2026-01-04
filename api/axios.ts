import axios from "axios";

export const api = axios.create({
  baseURL: "https://store-api.softclub.tj",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
