import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

interface User {
  id: number;
  name: string;
}

const initialState: User[] = [];

export const fetchUsers = createAsyncThunk("users/fetchusers", async () => {
  try {
    const response = await axios.get(USERS_URL);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        return action.payload;
      }
    );
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
