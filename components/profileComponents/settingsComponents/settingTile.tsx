import SizedBox from "@/components/SizedBox";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SettingTile({ leftIcon, settingTitle, hasNextPage, nextPage, rightComponent }
  : { leftIcon: string, settingTitle: string, hasNextPage?: boolean, nextPage?: Href, rightComponent?: React.ReactNode }
) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => {
      if(hasNextPage && nextPage) return router.push(nextPage)
    }} style={styles.tile}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome name={leftIcon} size={24} color={theme.text} />
        <SizedBox width={8} />
        <Text style={{ color: theme.text, ...styles.tileText }}>{settingTitle}</Text>
      </View>
      {hasNextPage
      ? <FontAwesome name="chevron-right" size={24} color="gray" />
      : rightComponent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 16
  },
  tileText: {
    fontSize: 16
  }
});