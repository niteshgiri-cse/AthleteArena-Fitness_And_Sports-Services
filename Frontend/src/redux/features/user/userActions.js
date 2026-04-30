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
  updatePost,
  deletePost,
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
    dispatch(fetchPostSuccess(data));
  } catch (error) {
    dispatch(fetchUserFailure(error?.response?.data || error.message));
  }
};

// ✅ UPDATE POST
export const updatePostAction = (postId, formData) => async (dispatch) => {
  try {
    dispatch(fetchUser());
    await updatePost(postId, formData);
    dispatch(getMyPostAction()); // refresh
  } catch (error) {
    dispatch(fetchUserFailure(error?.response?.data || error.message));
  }
};

export const deletePostAction = (postId) => async (dispatch) => {
  try {
    dispatch(fetchUser());

    console.log("DELETING POST:", postId);

    const res = await deletePost(postId);

    console.log("DELETE RESPONSE:", res);

    dispatch(getMyPostAction()); 
  } catch (error) {
    console.log("DELETE ERROR:", error.response?.data);

    dispatch(
      fetchUserFailure(
        error?.response?.data?.message || "Delete failed"
      )
    );
  }
};