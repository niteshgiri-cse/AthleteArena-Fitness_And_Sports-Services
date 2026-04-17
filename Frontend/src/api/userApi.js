import axios from "axios";
import BASE_URL from "@/config/api";

const publicAPI = axios.create({
  baseURL: BASE_URL,
});

publicAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== PROFILE =====
export const getProfile = async () => {
  return (await publicAPI.get("/user/profile")).data;
};

export const updateProfile = async (data) => {
  // 🔥 FIXED URL
  return (await publicAPI.put("/user/update-profile", data)).data;
};

// ===== POSTS =====
export const getMyPosts = async () => {
  return (await publicAPI.get("/user/posts")).data;
};
