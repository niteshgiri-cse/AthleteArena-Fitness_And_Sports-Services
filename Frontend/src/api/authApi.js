import BASE_URL from "@/config/api";
import axios from "axios";

const publicAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const privateAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

privateAPI.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export const signupUser = (data) =>
  publicAPI.post("/auth/signup", {
    name: data.name?.trim(),
    email: data.email?.trim(),
    password: data.password?.trim()
  });

export const loginUser = (data) =>
  publicAPI.post("/auth/login", {
    email: data.email?.trim(),
    password: data.password?.trim()
  });

export const getProfile = () => privateAPI.get("/profile");