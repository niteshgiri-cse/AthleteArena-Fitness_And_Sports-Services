import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {

    fetchMedia: (state) => {
      state.loading = true;
    },

    fetchMediaSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    },

    appendMedia: (state, action) => {
      state.loading = false;
      state.posts = [...state.posts, ...action.payload];
    },

    fetchMediaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

export const {
  fetchMedia,
  fetchMediaSuccess,
  fetchMediaFailure,
  appendMedia
} = mediaSlice.actions;

export default mediaSlice.reducer;