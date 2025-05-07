import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "@/contants/Colors";
import { TABBAR_HEIGHT } from "@/contants/values";
import { useTheme } from "@/hooks/useTheme";

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const themeMode = useSelector((state: any) => state?.theme?.mode) || "dark";
  const theme = useTheme();

  // useEffect(() => {}, []);

  return (
    <View style={{...styles.tabContainer, backgroundColor: theme.background}}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabButton}
            onPress={onPress}
          >
            <FontAwesome
              name={options.tabBarLabel}
              size={24}
              color={isFocused
                ? themeMode == "dark" ? 'white' : 'black'
                : "gray"
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: TABBAR_HEIGHT,
    borderTopWidth: 0,
    borderTopColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})