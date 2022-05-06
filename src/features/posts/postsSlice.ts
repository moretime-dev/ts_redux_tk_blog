import {
  createSlice,
  PayloadAction,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

import axios from "axios";

import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export interface Reaction {
  postId: string;
  reaction: string;
}

export interface SinglePost {
  id: string;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
}

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
            reactions: {
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
        existingPost.reactions[reaction]++;
      }
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<SinglePost[]>) => {
          state.status = "succeeded";
          //Adding Date and Reactions
          let minute = 1;
          const loadedPosts = action.payload.map((post) => {
            post.date = sub(new Date(), {
              minutes: minute++,
            }).toISOString();
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };

            return post;
          });
          // Add any fetched posts to the array
          // state.posts = state.posts.concat(loadedPosts);
          state.posts = [...state.posts, ...loadedPosts];
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
