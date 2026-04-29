import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminProfile: null,
  users: [],
  loading: false,
  error: null,
  success: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },

    adminProfileSuccess: (state, action) => {
      state.loading = false;
      state.adminProfile = action.payload;
    },

    adminUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },

    adminSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload;
    },

    adminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  adminRequest,
  adminProfileSuccess,
  adminUsersSuccess,
  adminSuccess,
  adminFailure,
} = adminSlice.actions;

export default adminSlice.reducer;