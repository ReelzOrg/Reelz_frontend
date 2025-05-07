import { navigateBack } from "@/utils";
import { CustomTheme } from "@/utils/types";
import { FontAwesome } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function TopNavBar({ theme, pageTitle, fallbackRoute }: {theme: CustomTheme, pageTitle: string, fallbackRoute: Href}) {
  const router = useRouter();

  return (
    <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: 8}}>
      <TouchableOpacity
      style={{marginLeft: 16}}
        onPress={() => {
          console.log("The fallback route is: ", fallbackRoute);
          if(fallbackRoute == undefined) {
            navigateBack({router: router, fallbackRoute: fallbackRoute, pushOrReplace: "replace"})
          } else {
            console.log("we are executing this")
            router.replace("/(tabs)/profile");
          }
        }}>
        <FontAwesome name="arrow-left" size={22} color={theme.text} />
      </TouchableOpacity>
      <Text style={{color: theme.text, marginLeft: 24, fontSize: 22, fontWeight: '700'}}>{pageTitle}</Text>
    </View>
  );
}