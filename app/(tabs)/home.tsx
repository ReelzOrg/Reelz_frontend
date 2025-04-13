import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar"
import { useSelector } from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView } from "react-native-gesture-handler";

import { Colors } from "@/contants/Colors";
import StoryView from "@/components/StoryView";
import SizedBox from "@/components/SizedBox";
import { useTheme } from "@/context/themeContext";

export default function Index() {
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  
  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1}}>
      <ScrollView>
      <View style={{ flex: 1, backgroundColor: theme.background, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{color: "white", fontSize: 20}}>Reelz</Text>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome name="heart" size={24} color={theme.text} style={{marginRight: 14}} />
            <FontAwesome name="envelope" size={24} color={theme.text} />
          </View>
        </View>
        <SizedBox height={14} />
        <ScrollView horizontal={true}>
          <StoryView />
        </ScrollView>
        {/* <PostView /> */}
      </View>
      </ScrollView>
      <StatusBar style={themeMode == 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
