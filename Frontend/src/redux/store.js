import authReducer from "@/redux/features/auth/authReducer";
import { configureStore } from "@reduxjs/toolkit";
import newsReducer from"@/redux/features/news/newsReducer"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer
  }
});