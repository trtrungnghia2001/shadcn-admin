import { createSlice } from "@reduxjs/toolkit";
import { initialTasks } from "./data";

export const taskSlice = createSlice({
  name: "tasks",
  initialState: initialTasks,
  reducers: {
    setTasks: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;
