import { Tabs } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import CustomTabBar from "@/components/CustomTabBar";
import { switchMode } from "@/state/slices/themeSlice";
import { Colors } from "@/contants/Colors";
import { getToken } from "@/utils/storage";

export default function TabsLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadTheme() {
      const mode = (await getToken("mode"));
      if (mode) {
        dispatch(switchMode(mode)); // Set the theme after loading
      }
    }

    loadTheme();
  }, [])

  return (
    <Tabs
    tabBar={(props) => (
      <CustomTabBar {...props} />
    )}
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        // paddingTop: Platform.OS == "ios" ? RFValue(5) : 0,
        // paddingBottom: Platform.OS == "ios" ? 20 : 10,
        // backgroundColor: "transparent",
        // height: Platform.OS == "android" ? 70 : 80,
        // borderTopWidth: 0,
        // position: "absolute" 
      },
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "#447777",
      headerShadowVisible: false,
      tabBarShowLabel: false,
    })}>
      <Tabs.Screen name="home" options={{tabBarLabel: "home"}} />
      <Tabs.Screen name="explore" options={{tabBarLabel: "search"}} />
      <Tabs.Screen name="create" options={{tabBarLabel: "plus-circle"}} />
      <Tabs.Screen name="reels" options={{tabBarLabel: "video-camera"}} />
      <Tabs.Screen name="profile" options={{tabBarLabel: "user-circle-o"}} />
    </Tabs>
  );
}
