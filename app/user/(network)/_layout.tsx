import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { useTheme } from "@/context/themeContext";

export default function UserNetwork() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
      <Slot />
    </SafeAreaView>
  );
}