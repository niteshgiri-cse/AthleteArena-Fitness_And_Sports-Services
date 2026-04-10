import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  jwt: localStorage.getItem("token") || null,
  error: null,
  loading: false
};

export const authSlice = createSlice({
  name: "auth_user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.jwt = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    },
    logout: (state) => {
      state.user = null;
      state.jwt = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;