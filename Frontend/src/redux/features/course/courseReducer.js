import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    courseRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    courseListSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },

    courseSuccess: (state, action) => {
      state.loading = false;
      state.selectedCourse = action.payload;
    },

    courseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  courseRequest,
  courseListSuccess,
  courseSuccess,
  courseFailure,
} = courseSlice.actions;

export default courseSlice.reducer;