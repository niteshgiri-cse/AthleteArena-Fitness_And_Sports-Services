import axios from "axios";
import BASE_URL from "@/config/api";

const eventAPI = axios.create({
  baseURL: BASE_URL,
});

// attach token (optional)
eventAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== GET ALL EVENTS =====
export const getAllEvents = async () => {
  const res = await eventAPI.get("/event");
  return res.data;
};