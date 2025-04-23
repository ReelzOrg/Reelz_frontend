import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@/context/themeContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { CustomTheme } from "@/utils/types";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    // flex: 1,
  },
  txtField: {
    borderRadius: 9,
    backgroundColor: theme.background,
  },
  textStyle: {
    color: theme.text
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14
  },
});

export default function TabSwitch({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");

  return (
    <View style={styles.container}>
      
      <View style={styles.tabHeader}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setActiveTab("posts")}>
            <FontAwesome name="th-large" size={24} color={activeTab === "posts" ? theme.text : "#777"} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setActiveTab("reels")}>
            <FontAwesome name="play" size={24} color={activeTab === "reels" ? theme.text : "#777"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* <ShowPosts tab={activeTab} data={[
        <View style={{backgroundColor: 'yellow', width: "100%", height: "100%"}}></View>,
        <View style={{backgroundColor: 'blue'}}></View>,
        <View style={{backgroundColor: 'green'}}></View>
      ]} numColumns={3} /> */}
      {children}
    </View>
  );
}

/**
 * store the username, first & last name, profile photo, number of followers & following & posts, bio in cache
 * Also store the first few posts from the last session in the cache
 */