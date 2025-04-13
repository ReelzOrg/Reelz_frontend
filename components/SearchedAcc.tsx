import { Link } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { useTheme } from "@/context/themeContext";
import { getData } from "@/utils";

export default function SearchedAccTile({username, first_name, last_name, profile_picture} : {username: string, first_name: string, last_name: string, profile_picture?: string}) {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://10.0.0.246:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

  const theme = useTheme();

  return (
    <Link style={{}} href={{
      pathname: "/user/[username]",
      params: { username: username }
    }} asChild>
      <Pressable>
      <View style={{flexDirection: "row", alignItems: "center", padding: 8}}>
        {profile_picture
          ? (<Image src={profile_picture} style={{width: 50, height: 50, borderRadius: 25}} />)
          : (<Image source={require('@/assets/images/placeholder.png')} style={{width: 50, height: 50, borderRadius: 25}} />)
        }
        <View style={{marginLeft: 10}}>
          <Text style={{fontSize: 18, fontWeight: "500", color: theme.text}}>{username}</Text>
          <Text style={{fontSize: 14, color: "#888"}}>{first_name} {last_name}</Text>
        </View>
      </View>
      </Pressable>
    </Link>
  );
}