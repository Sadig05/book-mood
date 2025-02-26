// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
  title: string;
  description: string;
  authors: string[];
  categories: string[];
  published_date: string;
  image: string;
}

interface UserState {
  id: number | null;
  username: string | null;
  
}

const initialState: UserState = {
  id: null,
  username: null,
  
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearCurrentUser: (state) => {
      state.id = null;
      state.username = null;
      
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
