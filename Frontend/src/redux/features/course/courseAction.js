import {
  courseRequest,
  courseSuccess,
  courseListSuccess,
  courseFailure,
} from "./courseReducer";

import { getAllVideos, getVideoById } from "@/api/courseApi";

// ===== GET ALL VIDEOS =====
export const getAllVideosAction = () => async (dispatch) => {
  try {
    dispatch(courseRequest());

    const data = await getAllVideos();

    dispatch(courseListSuccess(data));
  } catch (error) {
    dispatch(courseFailure(error?.response?.data || error.message));
  }
};

// ===== GET SINGLE VIDEO =====
export const getVideoByIdAction = (videoId) => async (dispatch) => {
  try {
    dispatch(courseRequest());

    const data = await getVideoById(videoId);

    dispatch(courseSuccess(data));
  } catch (error) {
    dispatch(courseFailure(error?.response?.data || error.message));
  }
};