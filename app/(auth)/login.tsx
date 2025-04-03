import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { CustomTheme, useTheme } from "@/context/themeContext";
import { SizedBox, TextField } from "@/components";
import { isEmailValid, postData } from "@/utils";
import { saveToken } from "@/utils/storage";
import { router } from "expo-router";
import { logo_t } from "@/contants/assets";
// import { setUser } from "@/state/slices/userSlice";

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
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000"
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width, height } = useWindowDimensions();

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
            />
            <TextField
              value={loginForm.password}
              onUserInput={(value: string) => handleFormInput(value, "password")}
              theme={theme}
              placeholder="Password"
              isPassword={true}
            />
            </View>
          </View>
          <View style={{width: '100%'}}>
            <TouchableOpacity onPress={async () => {
              //check for data validity
              if (!loginForm.password) { console.log("Password is required"); return; }

              if (!loginForm.email) { console.log("Email is required"); return; }
              else if (!isEmailValid(loginForm.email)) { console.log("email is not valid"); return; }

              let response = await postData(`${baseurl}/api/auth/login`, loginForm);
              console.log(response)

              if (response.success) {
                saveToken(response.token, "reelzUserToken");
                // dispatch(setUser(response.user))Ks
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
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}