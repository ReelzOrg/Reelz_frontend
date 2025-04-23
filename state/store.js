import { configureStore } from "@reduxjs/toolkit";

//import all the slices here
import themeReducer, { switchMode } from "./slices/themeSlice.ts";
import { getToken, loadData } from "@/utils/storage.js";
import userTokenReducer from "./slices/userTokenSlice.ts";
import userReducer from "./slices/userDataSlice.ts";

//add the above imported slices in this store which will combine all the reducers
const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    reelzUserToken: userTokenReducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE']
  //   }
  // })
});

const initTheme = async () => {
  const savedTheme = await getToken('theme');
  console.log("saved theme is: ", savedTheme);
  if(savedTheme) {
    console.log("-----\n", savedTheme);
    store.dispatch(switchMode(savedTheme.mode));
  }
}

initTheme();

export default store;