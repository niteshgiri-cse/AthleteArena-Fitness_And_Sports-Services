import axios from "axios";
import BASE_URL from "@/config/api";

// ================= AXIOS INSTANCE =================
const publicAPI = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically
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

export const uploadImage = async ({ file, title, description, category, tags }) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    if (tags && tags.length > 0) {
      tags.forEach(tag => formData.append("tags", tag));
    }

    const response = await publicAPI.post("/media/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;

  } catch (error) {
    console.error("Upload Image Error:", error);
    throw error.response?.data || error.message;
  }
};

export const uploadVideo = async ({ file, title, description, category, tags }) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    if (tags && tags.length > 0) {
      tags.forEach(tag => formData.append("tags", tag));
    }

    const response = await publicAPI.post("/media/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;

  } catch (error) {
    console.error("Upload Video Error:", error);
    throw error.response?.data || error.message;
  }
};

export const getMyMedia = async () => {
  try {
    const res = await publicAPI.get("/media/me");
    return res.data;
  } catch (error) {
    console.error("Get My Media Error:", error);
    throw error.response?.data || error.message;
  }
};

// ================= GET MY IMAGES =================
export const getMyImages = async () => {
  try {
    const res = await publicAPI.get("/media/me/images");
    return res.data;
  } catch (error) {
    console.error("Get My Images Error:", error);
    throw error.response?.data || error.message;
  }
};

// ================= GET MY VIDEOS =================
export const getMyVideos = async () => {
  try {
    const res = await publicAPI.get("/media/me/videos");
    return res.data;
  } catch (error) {
    console.error("Get My Videos Error:", error);
    throw error.response?.data || error.message;
  }
};

// ================= GET FEED =================
export const getFeed = async () => {
  try {
    const res = await publicAPI.get("/media/feed");
    return res.data;
  } catch (error) {
    console.error("Get Feed Error:", error);
    throw error.response?.data || error.message;
  }
};

// ================= DELETE MEDIA =================
export const deleteMedia = async (mediaId) => {
  try {
    const res = await publicAPI.delete(`/media/${mediaId}`);
    return res.data;
  } catch (error) {
    console.error("Delete Media Error:", error);
    throw error.response?.data || error.message;
  }
};