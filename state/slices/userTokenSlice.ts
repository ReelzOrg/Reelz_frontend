import { createSlice } from "@reduxjs/toolkit";

export interface userTokenObject {
  jwtToken: string;
}

const initialState: userTokenObject = {
  jwtToken: ''
};

const userTokenSlice = createSlice({
  name: 'userToken',
  initialState: initialState,
  reducers: {
    setJwtToken: (state: userTokenObject, action) => {
      state.jwtToken = action.payload;
    }
  }
});

export const { setJwtToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;