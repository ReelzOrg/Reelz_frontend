import TopNavBar from "@/components/TopNavBar";
import { useTheme } from "@/hooks/useTheme";
import { Text, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserSettings() {
  const theme = useTheme();

  return (
    <SafeAreaView>
      <TopNavBar pageTitle="Settings" theme={theme} fallbackRoute={"/(tabs)/profile"} />
      <ScrollView>
        <View>
          <Text>Settings</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}