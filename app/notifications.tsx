import { useTheme } from "@/hooks/useTheme";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyData = [
  {
    period: "last 7 days",
    data: [
      {
        id: 1,
        type: "like",
        user: "viraj.7",
        message: "Liked your post",
        time: "10:00 AM"
      },
      {
        id: 2,
        type: "comment",
        user: "vivek20",
        message: "Commented on your post",
        time: "10:00 AM"
      },
      {
        id: 3,
        type: "follow",
        user: "testUser1",
        message: "Started following you",
        time: "10:00 AM"
      }
    ]
  },
  {
    period: "last 30 days",
    data: [
      {
        id: 1,
        type: "posted",
        user: "viraj.7",
        message: "posted a new post",
        time: "10:00 AM"
      },
      {
        id: 2,
        type: "comment",
        user: "viraj.7",
        message: "Commented on your post",
        time: "10:00 AM"
      }
    ]
  }
]

export default function Notifications() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{backgroundColor: theme.background}}>
      {/* top bar */}
      <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
        <FontAwesome name="arrow-left" size={16} color={theme.text} />
        <Text style={{color: theme.text, marginLeft: 24}}>Notifications</Text>
      </View>

      <SectionList
        sections={dummyData}
        renderItem={({ item }) => (
          <View style={{padding: 10}}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <FontAwesome name="user" size={16} color={theme.text} />
                <Text style={{color: theme.text, marginLeft: 10}}>{item.user}</Text>
                <Text style={{color: theme.text, marginLeft: 10}}>{item.message}</Text>
                <Text style={{color: theme.text, marginLeft: 10}}>{item.time}</Text>
              </View>
          </View>
        )}
        renderSectionHeader={({ section: { period } }) => (
          <Text style={{color: theme.text, marginLeft: 10}}>{period}</Text>
        )}
      />
    </SafeAreaView>
  );
}