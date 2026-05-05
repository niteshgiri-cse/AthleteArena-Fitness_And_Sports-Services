import BASE_URL from "@/config/api";
import axios from "axios";

const publicAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const privateAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

privateAPI.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export const signupUser = async (data) => {
  const res = await publicAPI.post("/auth/signup", {
    name: data.name?.trim(),
    email: data.email?.trim(),
    password: data.password?.trim(),
  });

  return res.data;
};

export const loginUser = async (data) => {
  const res = await publicAPI.post("/auth/login", {
    email: data.email?.trim(),
    password: data.password?.trim(),
  });

  if (res.data?.jwt) {
    localStorage.setItem("token", res.data.jwt);
  }

  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getProfile = async () => {
  const res = await privateAPI.get("/profile");
  return res.data;
};