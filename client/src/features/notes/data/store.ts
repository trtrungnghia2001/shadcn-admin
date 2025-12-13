import { configureStore } from "@reduxjs/toolkit";
import columnReducer from "./columnSlice";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    columns: columnReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
