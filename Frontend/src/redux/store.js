import authReducer from "@/redux/features/auth/authReducer";
import { configureStore } from "@reduxjs/toolkit";
import newsReducer from"@/redux/features/news/newsReducer"
import mediaReducer from "@/redux/features/media/mediaReducer"
import userReducer from "@/redux/features/user/userReducer"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    media:mediaReducer,
    user: userReducer,
  }
});