import { UserObject } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

let initialState: UserObject = {
  _id: null,
  username: null,
  first_name: null,
  last_name: null,
  bio: null,
  follower_count: 0,
  following_count: 0,
  post_count: 0,
  profile_picture: null,
  is_private: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      // console.log("We are going to save the user info")
      // console.log(action.payload)
      try {
        state._id = action.payload._id;
        state.username = action.payload.username;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.bio = action.payload.bio;
        state.follower_count = action.payload.follower_count ?? 0;
        state.following_count = action.payload.following_count ?? 0;
        state.post_count = action.payload.post_count ?? 0;
        state.profile_picture = action.payload.profile_picture;

        // console.log("user data is saved in redux store")
        // console.log(action.payload)
        // console.log("=================================")
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