import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: null,
  userPost: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUser: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    },
    fetchPostSuccess: (state, action) => {
      state.loading = false;
      state.userPost = action.payload;
    },
    fetchUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUser,
  fetchUserSuccess,
  fetchPostSuccess,
  fetchUserFailure,
} = userSlice.actions;

export default userSlice.reducer;