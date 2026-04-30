import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    eventRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    eventSuccess: (state, action) => {
      state.loading = false;
      state.events = action.payload;
    },

    eventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  eventRequest,
  eventSuccess,
  eventFailure,
} = eventSlice.actions;

export default eventSlice.reducer;