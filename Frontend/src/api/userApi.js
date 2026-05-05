import axios from "axios";
import BASE_URL from "@/config/api";

const userAPI = axios.create({
  baseURL: BASE_URL,
});

userAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// PROFILE
export const getProfile = async () => {
  const res = await userAPI.get("/user/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await userAPI.put("/user/update-profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// POSTS
export const getMyPosts = async () => {
  const res = await userAPI.get("/user/posts");
  return res.data;
};

export const updatePost = async (postId, formData) => {
  const res = await userAPI.put(`/user/update-post/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await userAPI.delete(`/user/delete-post/${postId}`);
  return res.data;
};