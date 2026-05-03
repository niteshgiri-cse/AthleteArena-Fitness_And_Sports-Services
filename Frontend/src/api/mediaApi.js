import axios from "axios";
import BASE_URL from "@/config/api";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/* ===== MEDIA ===== */
export const uploadImage = (data) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("title", data.title);
  formData.append("description", data.description);

  data.category?.forEach((c) => formData.append("categories", c));
  data.tags?.forEach((t) => formData.append("tags", t));

  return API.post("/media/image", formData);
};

export const uploadVideo = (data) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("title", data.title);
  formData.append("description", data.description);

  data.category?.forEach((c) => formData.append("categories", c));
  data.tags?.forEach((t) => formData.append("tags", t));

  return API.post("/media/video", formData);
};

export const getFeed = (page = 0, size = 5) =>
  API.get(`/media/feed?page=${page}&size=${size}`);

/* ===== SOCIAL ===== */
export const toggleLike = (postId) =>
  API.post(`/like/${postId}`);

export const getComments = (postId) =>
  API.get(`/comment/${postId}`);

/* ✅ FIXED */
export const addComment = (postId, data) =>
  API.post(`/comment/${postId}`, data);
