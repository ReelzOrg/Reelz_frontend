import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "@/contants/Colors";

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const theme = useSelector((state: any) => state.theme.mode);;
  const [primaryColor, setPrimaryColor] = useState(theme === "dark" ? Colors.dark.background : Colors.light.background);

  useEffect(() => {
    setPrimaryColor(theme == "dark" ? Colors.dark.background : Colors.light.background);
  }, [theme]);

  return (
    <View style={{...styles.tabContainer, backgroundColor: primaryColor}}>
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
                ? theme == "dark" ? 'white' : 'black'
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
    height: 60,
    borderTopWidth: 0,
    borderTopColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})