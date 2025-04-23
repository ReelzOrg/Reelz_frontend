import { useTheme } from "@/context/themeContext";
import { CustomTheme } from "@/utils/types";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";

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

export default function DiscoverPeopleBtn() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  return (
    <Link style={styles.editProfileBtnStyle} href={"/(tabs)/profile/edit"}>
      <Text style={{ color: theme.text, textAlign: 'center' }}>
        <FontAwesome name="search-plus" size={16} />
      </Text>
    </Link>
  );
}