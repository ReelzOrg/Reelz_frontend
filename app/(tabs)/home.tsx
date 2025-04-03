import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar"
import { useSelector } from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView } from "react-native-gesture-handler";

import { Colors, Colors2 } from "@/contants/Colors";
import StoryView from "@/components/StoryView";
import SizedBox from "@/components/SizedBox";

export default function Index() {
  const theme = useSelector((state: any) => state.theme.mode);
  const [primaryColor, setPrimaryColor] = useState(theme == "dark" ? Colors.dark.background : Colors.light.background);
  
  useEffect(() => {
    setPrimaryColor(theme == "dark" ? Colors.dark.background : Colors.light.background);
  }, [theme]);

  return (
    <SafeAreaView style={{ backgroundColor: primaryColor, flex: 1}}>
      <ScrollView>
      <View style={{ flex: 1, backgroundColor: primaryColor, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{color: "white", fontSize: 20}}>Reelz</Text>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome name="heart" size={24} color={theme == "dark" ? Colors2.white : Colors2.black} style={{marginRight: 14}} />
            <FontAwesome name="envelope" size={24} color={theme == "dark" ? Colors2.white : Colors2.black} />
          </View>
        </View>
        <SizedBox height={14} />
        <ScrollView horizontal={true}>
          <StoryView />
        </ScrollView>
        {/* <PostView /> */}
      </View>
      </ScrollView>
      <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
