import axios from "axios";
import BASE_URL from "@/config/api";

const eventAPI = axios.create({
  baseURL: BASE_URL,
});

// attach token
eventAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== EVENTS =====
export const getAllEvents = async () => {
  const res = await eventAPI.get("/event");
  return res.data;
};

// ===== CREATE ORDER =====
export const createOrderAPI = async (eventId) => {
  const res = await eventAPI.post(`/bookings/create-order/${eventId}`);
  return res.data;
};

// ===== VERIFY PAYMENT =====
export const verifyPaymentAPI = async (data) => {
  const res = await eventAPI.post(`/bookings/verify`, data);
  return res.data;
};