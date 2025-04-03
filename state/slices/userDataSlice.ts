import { createSlice } from "@reduxjs/toolkit";

export interface UserObject {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  post_count: number;
  profile_picture: string | null;
  dob: string | null;
}

let initialState: UserObject = {
  username: null,
  first_name: null,
  last_name: null,
  email: null,
  bio: null,
  follower_count: 0,
  following_count: 0,
  post_count: 0,
  profile_picture: null,
  dob: null
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      try {
        state.username = action.payload.username;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.email = action.payload.email;
        state.bio = action.payload.bio;
        state.follower_count = action.payload.follower_count;
        state.following_count = action.payload.following_count;
        state.post_count = action.payload.post_count;
        state.profile_picture = action.payload.profile_picture;
        state.dob = action.payload.dob;
      } catch(err) {
        //this try catch is to prevent any previous errors to maybe not allow the request to be made properly 
        //if the req doesnt go through then the server will respond with just a string message and hence
        //all of the abive would be null
        console.log("There was an error saving the user data in redux:", err);
      }
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;