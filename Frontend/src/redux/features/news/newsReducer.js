import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  news: [],
  error: null,
  loading: false,
};

const newsSlice = createSlice({
  name: "news_article",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.news = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = newsSlice.actions;

export default newsSlice.reducer;