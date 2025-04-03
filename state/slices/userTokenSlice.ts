import { createSlice } from "@reduxjs/toolkit";

const userTokenSlice = createSlice({
  name: 'UserToken',
  initialState: { jwtToken: '' },
  reducers: {
    setJwtToken: (state, action) => {
      state.jwtToken = action.payload;
    }
  }
});

export const { setJwtToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;