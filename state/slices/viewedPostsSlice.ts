import { createSlice } from "@reduxjs/toolkit";

const viewedPostsSlice = createSlice({
  name: "viewedPosts",
  initialState: [],
  reducers: {
    addViewedPost: (state: Array<any>, action) => {
      state.push(action.payload)
    },
    clearViewedPosts: (state) => {
      state = [];
    }
  }
});

export const { addViewedPost, clearViewedPosts } = viewedPostsSlice.actions;
export default viewedPostsSlice.reducer;