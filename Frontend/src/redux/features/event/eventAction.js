import {
  eventRequest,
  eventSuccess,
  eventFailure,
} from "./eventReducer";

import { getAllEvents } from "@/api/eventApi";

// ===== GET ALL EVENTS =====
export const getAllEventsAction = () => async (dispatch) => {
  try {
    dispatch(eventRequest());

    const data = await getAllEvents();

    dispatch(eventSuccess(data));

    return data;
  } catch (error) {
    dispatch(eventFailure(error?.response?.data || error.message));
    throw error;
  }
};