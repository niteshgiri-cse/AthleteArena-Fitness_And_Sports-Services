import axios from "axios";
import BASE_URL from "@/config/api";

const publicAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getNewsArticles = () => {
  return publicAPI.get("/news/article");
};