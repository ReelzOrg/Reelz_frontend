import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import UserBasicInfo from "@/components/profileComponents/basicInfo";
import { getData } from "@/utils";
import { CustomTheme, UserObject, UserProfileResponse } from "@/utils/types";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});

export default function AllUserProfilePage() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const loggedInUserId = useSelector((state: any) => state.user._id);
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  //because we get here from the explore page from the SearchedAccTile component
  //we are not using the username now
  const { username } = useLocalSearchParams();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  console.log("We are in other user profile page");

  useEffect(() => {
    async function getUserData() {
      const user = await getData(`${baseurl}/api/user/${username}`, token);
      const userData = await user?.json();
      console.log("user data is: ", userData);
      if(userData.success) {
        setUser(userData.user);
      }
    }

    getUserData();
  }, [])

  if(!user) return (<></>);

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView>
        <UserBasicInfo user={user} addFollowBtn={!user.isUserAcc} />

        {/* from the request we make to fetch the user profile we get if the logged in user follows
        the requested user. only if the logged in user follow the requested user then fetch the followers & following */}
        {user.is_private && (user.followStatus == "none" || user.followStatus == "requested" || user.followStatus == "blocked")
          ? <Text>You can not see the posts of this user</Text>
          : <Text>You can see the posts of this user</Text>
        }

      </ScrollView>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}