import { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { ResizeMode, Video } from "expo-av";

import { useTheme } from "@/context/themeContext";
import { CustomTheme } from "@/utils/types";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});

export default function Reels() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  useEffect(() => {
    //fetch any reel
  }, []);

  return (
    <View>
      {/* <Video resizeMode={ResizeMode.COVER} /> */}
    </View>
  );
}