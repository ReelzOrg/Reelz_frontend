import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

import { CustomTheme, useTheme } from "@/context/themeContext";
import { getData } from "@/utils";
import { getToken } from "@/utils/storage";
import { setUser } from "@/state/slices/userDataSlice";
import { UserObject } from "@/utils/types";
import { placeholder } from "@/contants/assets";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  userInfo: {
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 24
  },
  textStyle: {
    color: theme.text
  },
  dpStyle: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});

export default function Profile() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.theme.mode);
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken)
  // const user = useSelector((state: any) => state.user);
  const [user, setUserState] = useState<UserObject | null>(null);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    async function getUserData() {
      const url = `${baseurl}/api/user/me`;
      console.log("url is: ", url);
      const userProfile = await getData(url, token);
      const data = await userProfile?.json();
      console.log("user data is: ", data.user);
      setUserState(data.user);
      dispatch(setUser(data.user));
    }

    getUserData();
  }, []);

  console.log("The baseurl is: ", baseurl);
  console.log("user is: ", user);

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.userInfo}>
            <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
              <Text style={{...styles.textStyle, fontSize: 20}}>{user?.username}</Text>
              <TouchableOpacity onPress={() => {}}>
                <FontAwesome name="bars" color={theme.text} size={20} />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}>
              {user && user.profile_picture
              ? (<Image src={user.profile_picture} style={styles.dpStyle} />)
              : (<Image source={placeholder} style={styles.dpStyle} />)}
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}