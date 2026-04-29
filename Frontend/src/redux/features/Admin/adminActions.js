import {
  adminRequest,
  adminProfileSuccess,
  adminUsersSuccess,
  adminSuccess,
  adminFailure,
} from "./adminReducer";

import {
  getAdminProfile,
  updateAdminProfile,
  createEvent,
  createCourse,
  getUsersDetails,
  registerAdmin,
  deleteCourse,
  updateCourse,
  deleteEvent,
  updateEvent,
} from "@/api/adminApi";

// ===== PROFILE =====
export const getAdminProfileAction = () => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await getAdminProfile();

    dispatch(adminProfileSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

export const updateAdminProfileAction = (formData) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await updateAdminProfile(formData);

    dispatch(adminSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

// ===== EVENT =====
export const createEventAction = (formData) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await createEvent(formData);

    dispatch(adminSuccess(data));

    return data; // ✅ FIX
  } catch (error) {
    console.log("EVENT ERROR:", error?.response?.data);

    dispatch(adminFailure(error?.response?.data || error.message));

    throw error; // ✅ FIX
  }
};

// ===== COURSE =====
export const createCourseAction = (formData) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await createCourse(formData);

    dispatch(adminSuccess(data));

    return data; // ✅ FIX
  } catch (error) {
    console.log("COURSE ERROR:", error?.response?.data);

    dispatch(adminFailure(error?.response?.data || error.message));

    throw error; // ✅ FIX
  }
};

// ===== USERS =====
export const getUsersDetailsAction = () => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await getUsersDetails();

    dispatch(adminUsersSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

// ===== REGISTER ADMIN =====
export const registerAdminAction = (payload) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await registerAdmin(payload);

    dispatch(adminSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

// ================= COURSE =================

// DELETE COURSE
export const deleteCourseAction = (videoId) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await deleteCourse(videoId);

    dispatch(adminSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

// UPDATE COURSE
export const updateCourseAction = (videoId, formData) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await updateCourse(videoId, formData);

    dispatch(adminSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

// ================= EVENT =================

// DELETE EVENT
export const deleteEventAction = (eventId) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await deleteEvent(eventId);

    dispatch(adminSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};

// UPDATE EVENT
export const updateEventAction = (eventId, formData) => async (dispatch) => {
  try {
    dispatch(adminRequest());

    const data = await updateEvent(eventId, formData);

    dispatch(adminSuccess(data));

    return data;
  } catch (error) {
    dispatch(adminFailure(error?.response?.data || error.message));
    throw error;
  }
};