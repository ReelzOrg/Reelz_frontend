import { Text, StyleSheet, View } from "react-native";

import { CustomTheme } from "@/utils/types";
import { useTheme } from "@/context/themeContext";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "expo-router";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  editProfileBtnStyle: {
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.text,
    backgroundColor: "transparent",
  },
})

export default function EditProfileBtn() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  
  return (
    <View style={{flex: 1}}>
      <Link style={styles.editProfileBtnStyle} href={"/(tabs)/profile/edit"}>
        <Text style={{ color: theme.text, fontSize: 16, textAlign: 'center' }}>Edit Profile</Text>
      </Link>
    </View>
  );
}