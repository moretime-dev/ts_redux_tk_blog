import {
  createSlice,
  PayloadAction,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

import axios from "axios";

// import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export interface Reaction {
  postId: string;
  reaction: string;
}

export type SinglePost = {
  id: string;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reaction: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
};

export interface Post {
  posts: SinglePost[];
  status: string;
  error: null | string;
}

const initialState: Post = { posts: [], status: "idle", error: null };

export const fetchPosts = createAsyncThunk("posts/fetchposts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<SinglePost>) {
        state.posts.push(action.payload);
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reaction: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },

    reactionAdded(state, action: PayloadAction<Reaction>) {
      const { postId, reaction } = action.payload;
      const existingPost: Post | any = state.posts.find(
        (post) => post.id === postId
      );
      if (existingPost) {
        existingPost.reaction[reaction]++;
      }
    },
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
