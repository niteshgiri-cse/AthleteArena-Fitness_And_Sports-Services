import {
  fetchMedia,
  fetchMediaSuccess,
  fetchMediaFailure
} from "./mediaReducer";

import {
  getMyMedia,
  getMyImages,
  getMyVideos,
  getFeed,
  deleteMedia
} from "@/api/mediaApi";

// ================= ALL =================
export const getMyMediaAction = () => async (dispatch) => {
  try {
    dispatch(fetchMedia());
    const data = await getMyMedia();
    dispatch(fetchMediaSuccess(data));
  } catch (error) {
    dispatch(fetchMediaFailure(error));
  }
};

// ================= IMAGES =================
export const getMyImagesAction = () => async (dispatch) => {
  try {
    dispatch(fetchMedia());
    const data = await getMyImages();
    dispatch(fetchMediaSuccess(data));
  } catch (error) {
    dispatch(fetchMediaFailure(error));
  }
};

// ================= VIDEOS =================
export const getMyVideosAction = () => async (dispatch) => {
  try {
    dispatch(fetchMedia());
    const data = await getMyVideos();
    dispatch(fetchMediaSuccess(data));
  } catch (error) {
    dispatch(fetchMediaFailure(error));
  }
};

// ================= FEED =================
export const getFeedAction = () => async (dispatch) => {
  try {
    dispatch(fetchMedia());
    const data = await getFeed();
    dispatch(fetchMediaSuccess(data));
  } catch (error) {
    dispatch(fetchMediaFailure(error));
  }
};

// ================= DELETE =================
export const deleteMediaAction = (id) => async (dispatch) => {
  try {
    await deleteMedia(id);
    dispatch(getMyMediaAction());
  } catch (error) {
    dispatch(fetchMediaFailure(error));
  }
};