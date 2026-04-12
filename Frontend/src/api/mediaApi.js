import axios from "axios";
import BASE_URL from "@/config/api";

const publicAPI = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Token attach
publicAPI.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ================= UPLOAD IMAGE =================
export const uploadImage = async ({ file, title, description, category, tags }) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    // ✅ categories fix
    if (category && category.length > 0) {
      category.forEach((c) => formData.append("categories", c));
    }

    if (tags && tags.length > 0) {
      tags.forEach((tag) => formData.append("tags", tag));
    }

    const res = await publicAPI.post("/media/image", formData);
    return res.data;

  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ================= UPLOAD VIDEO =================
export const uploadVideo = async ({ file, title, description, category, tags }) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    if (category && category.length > 0) {
      category.forEach((c) => formData.append("categories", c));
    }

    if (tags && tags.length > 0) {
      tags.forEach((tag) => formData.append("tags", tag));
    }

    const res = await publicAPI.post("/media/video", formData);
    return res.data;

  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFeed = async (page = 0, size = 5) => {
  return (await publicAPI.get(`/media/feed?page=${page}&size=${size}`)).data;
};

export const deleteMedia = async (id) => {
  return (await publicAPI.delete(`/media/${id}`)).data;
};