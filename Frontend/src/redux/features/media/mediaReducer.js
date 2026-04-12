import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mediaPost: [],
  loading: false,
  error: null
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    fetchMedia: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMediaSuccess: (state, action) => {
      state.loading = false;
      state.mediaPost = action.payload;
    },
    fetchMediaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchMedia,
  fetchMediaSuccess,
  fetchMediaFailure
} = mediaSlice.actions;

export default mediaSlice.reducer;