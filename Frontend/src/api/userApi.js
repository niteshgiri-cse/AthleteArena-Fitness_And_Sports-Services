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
  return (await publicAPI.put("/user/update-profile", data)).data;
};

// ===== POSTS =====
export const getMyPosts = async () => {
  return (await publicAPI.get("/user/posts")).data;
};

// ✅ UPDATE POST
export const updatePost = async (postId, formData) => {
  return (
    await publicAPI.put(`/user/update-post/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

// ✅ DELETE POST
export const deletePost = async (postId) => {
  return (await publicAPI.delete(`/user/delete-post/${postId}`)).data;
};