import axios from "axios";

const instance = axios.create({
  baseURL: "https://meterflow-3.onrender.com/"  // ← paste your Render URL here
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;