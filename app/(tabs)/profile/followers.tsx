import { useEffect } from "react";
import { Text, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserSettings() {
  
  useEffect(() => {
    //call api to fetch all followers
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Followers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}