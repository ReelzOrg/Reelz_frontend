import { Text, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserSettings() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Settings</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}