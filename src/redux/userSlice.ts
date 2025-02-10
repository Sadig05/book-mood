// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  username: string | null;
  // Add additional properties as needed
}

const initialState: UserState = {
  id: null,
  name: null,
  username: null,
  email: null,
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
      state.name = null;
      state.email = null;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
