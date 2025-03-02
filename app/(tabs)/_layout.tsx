import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function TabLayout() {
  return (
    <Tabs screenOptions={({route}) => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        paddingTop: Platform.OS == "ios" ? RFValue(5) : 0,
        paddingBottom: Platform.OS == "ios" ? 20 : 10,
        backgroundColor: "transparent",
        height: Platform.OS == "android" ? 70 : 80,
        borderTopWidth: 20 
      }
    })}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="PostScreen" />
      <Tabs.Screen name="ProfileScreen" />
    </Tabs>
  );
}