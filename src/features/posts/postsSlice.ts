import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Post {
  id: string;
  title: string;
  content: string;
}

const initialState: Post[] = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard good things",
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice, the more I want pizza...",
  },
];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
});

export const selectAllPosts = (state: RootState) => state.posts;

export default postSlice.reducer;
