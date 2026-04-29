    import axios from "axios";
    import BASE_URL from "@/config/api";

    const courseAPI = axios.create({
    baseURL: BASE_URL,
    });

    // (Optional) attach token like adminAPI
    courseAPI.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
    });

    // ===== GET ALL VIDEOS =====
    export const getAllVideos = async () => {
    const res = await courseAPI.get("/course/get-All-video");
    return res.data;
    };

    // ===== GET VIDEO BY ID =====
    export const getVideoById = async (videoId) => {
    const res = await courseAPI.get(`/course/${videoId}`);
    return res.data;
    };