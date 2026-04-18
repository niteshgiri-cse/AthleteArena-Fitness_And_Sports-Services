import {
  fetchUser,
  fetchUserSuccess,
  fetchPostSuccess,
  fetchUserFailure,
} from "./userReducer";

import {
  getProfile,
  updateProfile,
  getMyPosts,
} from "@/api/userApi";

// ===== GET PROFILE =====
export const getProfileAction = () => async (dispatch) => {
  try {
    dispatch(fetchUser());
    const data = await getProfile();
    
    dispatch(fetchUserSuccess(data));
  } catch (error) {
    dispatch(fetchUserFailure(error?.response?.data || error.message));
  }
};

// ===== UPDATE PROFILE =====
export const updateProfileAction = (data) => async (dispatch) => {
  try {
    dispatch(fetchUser());
    await updateProfile(data);
    dispatch(getProfileAction());
  } catch (error) {
    dispatch(fetchUserFailure(error?.response?.data || error.message));
  }
};

// ===== GET POSTS =====
export const getMyPostAction = () => async (dispatch) => {
  try {
    dispatch(fetchUser());
    const data = await getMyPosts();
    console.log(data)
    dispatch(fetchPostSuccess(data));
  } catch (error) {
    dispatch(fetchUserFailure(error?.response?.data || error.message));
  }
};
