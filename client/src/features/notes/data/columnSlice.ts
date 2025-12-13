import { createSlice } from "@reduxjs/toolkit";
import { initialColumns } from "./data";

export const columnSlice = createSlice({
  name: "columns",
  initialState: initialColumns,
  reducers: {
    setColumns: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setColumns } = columnSlice.actions;
export default columnSlice.reducer;
