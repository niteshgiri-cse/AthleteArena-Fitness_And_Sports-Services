import axios from "axios";
import BASE_URL from "@/config/api";

const adminAPI = axios.create({
  baseURL: BASE_URL,
});

adminAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// PROFILE
export const getAdminProfile = async () => {
  const res = await adminAPI.get("/admin/profile");
  return res.data;
};

export const updateAdminProfile = async (data) => {
  const res = await adminAPI.put("/admin/update-details", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// EVENT
export const createEvent = async (data) => {
  const res = await adminAPI.post("/admin/create-event", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// COURSE
export const createCourse = async (data) => {
  const res = await adminAPI.post("/admin/create-course", data, {
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: [(data) => data],
  });
  return res.data;
};

// USERS
export const getUsersDetails = async () => {
  const res = await adminAPI.get("/admin/get-users-details");
  return res.data;
};

// REGISTER
export const registerAdmin = async (data) => {
  const res = await adminAPI.post("/admin/register-new-admin", data);
  return res.data;
};

// DELETE COURSE
export const deleteCourse = async (videoId) => {
  const res = await adminAPI.delete(`/admin/course/${videoId}`);
  return res.data;
};

// UPDATE COURSE
export const updateCourse = async (videoId, data) => {
  const res = await adminAPI.put(`/admin/course/${videoId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE EVENT
export const deleteEvent = async (eventId) => {
  const res = await adminAPI.delete(`/admin/event/${eventId}`);
  return res.data;
};

// UPDATE EVENT
export const updateEvent = async (eventId, data) => {
  const res = await adminAPI.put(`/admin/event/${eventId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};