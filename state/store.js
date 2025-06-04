import { configureStore } from "@reduxjs/toolkit";

//import all the slices here
import themeReducer, { switchMode } from "./slices/themeSlice.ts";
import { getToken, loadData, saveToken } from "@/utils/storage.js";
import userTokenReducer from "./slices/userTokenSlice.ts";
import userReducer from "./slices/userDataSlice.ts";
import viewedPostsReducer from "./slices/viewedPostsSlice.ts"

//add the above imported slices in this store which will combine all the reducers
const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    reelzUserToken: userTokenReducer,
    viewedPosts: viewedPostsReducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE']
  //   }
  // })
});

const initTheme = async () => {
  const savedTheme = await getToken('theme');
  console.log("saved theme is:", savedTheme);
  if(savedTheme == "dark" || savedTheme == "light") {
    console.log("-----\n");
    store.dispatch(switchMode(savedTheme));
  } else {
    console.log("are we saving to sesure store again?");
    await saveToken("dark", "theme")
  } 
}

initTheme();

export default store;