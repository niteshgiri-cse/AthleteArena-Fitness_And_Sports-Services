import {
  eventRequest,
  eventSuccess,
  eventFailure,
} from "./eventReducer";

import { getAllEvents, createOrderAPI } from "@/api/eventApi";

// ===== GET EVENTS =====
export const getAllEventsAction = () => async (dispatch) => {
  try {
    dispatch(eventRequest());
    const data = await getAllEvents();
    dispatch(eventSuccess(data));
  } catch (error) {
    dispatch(eventFailure(error?.response?.data || error.message));
  }
};

// ===== REGISTER EVENT =====
export const registerEventAction = (eventId) => async () => {
  try {
    const data = await createOrderAPI(eventId);
    return data;
  } catch (error) {
    alert(error?.response?.data || "Error creating order");
  }
};