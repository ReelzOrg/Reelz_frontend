import React, { useEffect } from "react";
import { Text, View } from "react-native";
import "react-native-gesture-handler";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";


export default function Index() {
  useEffect(() => {
    // GoogleSignin.configure({
    //   webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    //   forceCodeForRefreshToken: true,
    //   offlineAccess: false,
    //   iosClientId: process.env.GOOGLE_IOS_CLIENT_ID
    // })
  })
  return (
    <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}>
      <Text>Apps</Text>
    </View>
  );
}
