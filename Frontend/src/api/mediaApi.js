import axios from "axios";
import BASE_URL from "@/config/api";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

/* MEDIA */
export const uploadImage = async (data) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("title", data.title);
  formData.append("description", data.description);

  data.category?.forEach((c) => formData.append("categories", c));
  data.tags?.forEach((t) => formData.append("tags", t));

  const res = await API.post("/media/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const uploadVideo = async (data) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("title", data.title);
  formData.append("description", data.description);

  data.category?.forEach((c) => formData.append("categories", c));
  data.tags?.forEach((t) => formData.append("tags", t));

  const res = await API.post("/media/video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const getFeed = async (page = 0, size = 5) => {
  const res = await API.get(`/media/feed?page=${page}&size=${size}`);
  return res.data;
};

/* SOCIAL */
export const toggleLike = async (postId) => {
  const res = await API.post(`/like/${postId}`);
  return res.data;
};

export const getComments = async (postId) => {
  const res = await API.get(`/comment/${postId}`);
  return res.data;
};

export const addComment = async (postId, data) => {
  const res = await API.post(`/comment/${postId}`, data);
  return res.data;
};