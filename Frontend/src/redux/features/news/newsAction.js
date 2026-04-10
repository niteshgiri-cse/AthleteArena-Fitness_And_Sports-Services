import { getNewsArticles } from "@/api/newsApi";
import { fetchStart, fetchSuccess, fetchFailure } from "./newsReducer";

export const fetchNewsData = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await getNewsArticles();
    dispatch(fetchSuccess(res.data));
  } catch (error) {
    dispatch(fetchFailure(error.response?.data || error.message));
  }
};