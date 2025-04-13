import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@/context/themeContext";
import { getData } from "@/utils";
import { setUser } from "@/state/slices/userDataSlice";
import { CustomTheme, UserProfileResponse } from "@/utils/types";
import TabSwitch from "@/components/profileComponents/TabSwitch";
import UserBasicInfo from "@/components/profileComponents/basicInfo";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});

export default function Profile() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.theme.mode);
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  // const user = useSelector((state: any) => state.user);
  const [user, setUserState] = useState<UserProfileResponse | null>(null);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    async function getUserData() {
      const url = `${baseurl}/api/user/me`;
      console.log("url is: ", url);
      const userProfile = await getData(url, token);
      console.log("url is: ", url);
      const data = await userProfile?.json();
      console.log("user data is: ", data.user);
      setUserState(data.user);
      dispatch(setUser(data.user));
    }

    //if the wifi or mobile data is weak or is offline then get the data from the redux store
    //add an if condition here to check the user variable and if the user is null then get the data
    // from the redux store
    getUserData();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>

          {/* User Profile Info */}
          <UserBasicInfo user={user} />

          {/* User Posts and Reels */}
          <View style={{width: '100%'}}>
            <TabSwitch />
          </View>
        </View>
      </ScrollView>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}