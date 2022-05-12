import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  nanoid,
} from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

import axios from "axios";

import { sub } from "date-fns";
import { act } from "react-dom/test-utils";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export interface Reaction {
  postId: number;
  reaction: string;
}

export interface SinglePost {
  id: number;
  title: string;
  body: string;
  userId: number;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
}

type PostToUpdate = Partial<SinglePost>;

export interface Posts {
  posts: SinglePost[];
  status: string;
  error: null | string;
}

interface PostToAdd {
  title: string;
  body: string;
  userId: number;
}

const initialState: Posts = { posts: [], status: "idle", error: null };

export const fetchPosts = createAsyncThunk("posts/fetchposts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: PostToAdd) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "/posts/updatePost",
  async (initialPost: PostToUpdate) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action: PayloadAction<Reaction>) {
      const { postId, reaction } = action.payload;
      const existingPost: Posts | any = state.posts.find(
        (post) => post.id === postId
      );
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },

    deletePost(state, action: PayloadAction<{ id?: number }>) {},
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
          // Add any fetched posts to the array <--- Wrong
          state.posts = loadedPosts;
          // state.posts = [...state.posts, ...loadedPosts];
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
      })
      .addCase(
        addNewPost.fulfilled,
        (state, action: PayloadAction<SinglePost>) => {
          action.payload.id = +nanoid();
          action.payload.userId = Number(action.payload.userId);
          action.payload.date = new Date().toISOString();
          action.payload.reactions = action.payload.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };

          state.posts.push(action.payload);
        }
      )
      .addCase(
        updatePost.fulfilled,
        (state, action: PayloadAction<PostToUpdate>) => {
          if (!action.payload?.id) {
            console.log("Update could not be completed");
            console.log(action.payload);
            return;
          }
          const { id } = action.payload;
          action.payload.date = new Date().toISOString();
          const posts = state.posts.filter((post) => post.id !== id);
          state.posts = [...posts, action.payload as SinglePost];
        }
      );
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const selectPostById = (state: RootState, postId: number) =>
  state.posts.posts.find((post) => post.id === postId);

export const { reactionAdded, deletePost } = postsSlice.actions;

export default postsSlice.reducer;
