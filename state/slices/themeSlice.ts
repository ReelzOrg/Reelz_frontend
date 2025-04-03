import { createSlice } from "@reduxjs/toolkit";

import { loadData, saveData } from "@/utils/storage";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "dark" },
  reducers: {
    switchMode: (state, action) => {
      state.mode = action.payload;
      // saveData('mode', action.payload)
    }
  }
});

export const { switchMode } = themeSlice.actions
export default themeSlice.reducer;