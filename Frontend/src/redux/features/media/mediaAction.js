import {
  fetchMedia,
  fetchMediaSuccess,
  fetchMediaFailure,
  appendMedia,
} from "./mediaReducer";

import { getFeed, toggleLike } from "@/api/mediaApi";

/* ===== FEED WITH PAGINATION ===== */
export const getFeedAction = (page = 0) => async (dispatch) => {
  try {
    dispatch(fetchMedia());

    const res = await getFeed(page);
    const data = res?.data?.content || [];

    if (page === 0) {
      dispatch(fetchMediaSuccess(data));
    } else {
      dispatch(appendMedia(data));
    }
  } catch (err) {
    console.error("Feed Error:", err);
    dispatch(fetchMediaFailure(err?.message || "Failed to load feed"));
  }
};

/* ===== LIKE (FIXED PROPERLY) ===== */
export const toggleLikeAction = (postId) => async (dispatch, getState) => {
  try {
    // ✅ Call API
    await toggleLike(postId);

    const { media } = getState();

    // ✅ Safe immutable update
    const updatedPosts = media.posts.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;

        return {
          ...post,
          isLiked,
          likeCount: isLiked
            ? post.likeCount + 1
            : Math.max(post.likeCount - 1, 0),
        };
      }
      return post;
    });

    // ✅ IMPORTANT: don't break pagination
    dispatch(fetchMediaSuccess(updatedPosts));

  } catch (err) {
    console.error("Like Error:", err);
  }
};