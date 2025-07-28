import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { TextField } from "@/components";
import { isEmailValid, postData } from "@/utils";
import { saveToken } from "@/utils/storage";
import { logo_t } from "@/contants/assets";
import { CustomTheme } from "@/utils/types";
import { setJwtToken, setUser } from "@/state/slices";
import { useTheme } from "@/hooks/useTheme";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    // marginTop: 40
  },
  txtField: {
    borderRadius: 9,
    backgroundColor: theme.background,
  },
});

export default function LoginScreen() {
  console.log("We ar ein login screen");
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000"
  const dispatch = useDispatch();
  // const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // const { width, height } = useWindowDimensions();

  const [loginForm, setLoginForm] = useState({email: '', password: ''})

  function handleFormInput(value: string, changedData: string) {
    setLoginForm({ ...loginForm, [changedData]: value })
  }
  
  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
      <ScrollView contentContainerStyle={{justifyContent: "center", flexGrow: 1}}>
        {/* <SizedBox height={height/10} /> */}
        <View style={styles.container}>
          <Image source={logo_t} style={{width: 200, height: 200}} resizeMode="contain" />

          <View style={{ alignItems: 'center', width: "100%", marginBottom: 60 }}>
          <View style={{ width: "100%", maxWidth: 500 }}>
            <TextField
              value={loginForm.email}
              onUserInput={(value: string) => handleFormInput(value, "email")}
              theme={theme}
              placeholder="Your email or username"
              keyboard="email-address"
              styles={{marginTop: 16}}
            />
            <TextField
              value={loginForm.password}
              onUserInput={(value: string) => handleFormInput(value, "password")}
              theme={theme}
              placeholder="Password"
              isPassword={true}
              styles={{marginTop: 16}}
            />
            </View>
          </View>
          <View style={{width: '100%'}}>
            <TouchableOpacity onPress={async () => {
              //check for data validity
              if (!loginForm.password) { console.log("Password is required"); return; }

              if (!loginForm.email) { console.log("Email is required"); return; }
              else if (!isEmailValid(loginForm.email)) { console.log("email is not valid"); return; }

              const response = await postData(`${baseurl}/api/auth/login`, loginForm);
              const authRes = await response?.json();
              console.log(authRes)

              if (authRes.success) {
                saveToken(authRes.token, "reelzUserToken");
                dispatch(setUser(authRes.user))
                dispatch(setJwtToken(authRes.token))

                router.replace('/(tabs)/home');
              } else {
                console.log("The login was not sucessfull")
              }
            }}>
              <Text style={{ textAlign: 'center', paddingVertical: 10, fontSize: 18, color: "white", borderRadius: 9, backgroundColor: 'green' }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              if(router.canGoBack()) {
                router.back();
              } else {
                router.push("/(auth)/register");
              }
            }}>
              <Text style={{ textAlign: 'center', color: '#2255ff', fontSize: 18, marginTop: 20 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}