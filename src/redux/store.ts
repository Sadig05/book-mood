import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
  },
});

// Types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
