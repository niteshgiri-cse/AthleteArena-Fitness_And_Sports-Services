import authReducer from "@/redux/features/auth/authReducer";
import { configureStore } from "@reduxjs/toolkit";
import newsReducer from"@/redux/features/news/newsReducer"
import mediaReducer from "@/redux/features/media/mediaReducer"
import userReducer from "@/redux/features/user/userReducer"
import adminReducer from "@/redux/features/Admin/adminReducer"
import courseReducer from "@/redux/features/course/courseReducer"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    media:mediaReducer,
    user: userReducer,
    admin:adminReducer,
    course: courseReducer,
  }
});