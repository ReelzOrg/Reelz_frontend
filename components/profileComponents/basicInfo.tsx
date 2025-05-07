import { Link, useRouter } from "expo-router";
import { TouchableOpacity, View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useMemo } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { placeholder } from "@/contants/assets";
// import { useTheme } from "@/context/themeContext";
// import { CustomTheme, UserProfileResponse, FollowStatus } from "@/utils/types";
import { CustomTheme, UserProfileResponse } from "@/utils/types";
import FollowBtn from "./followBtn";
import EditProfileBtn from "./EditProfileBtn";
import DiscoverPeopleBtn from "./DiscoverPeopleBtn";
import { useTheme } from "@/hooks/useTheme";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  userInfo: {
    marginVertical: 14,
    width: '100%',
    paddingHorizontal: 20
  },
  dpStyle: {
    width: 90,
    height: 90,
    borderRadius: 45
  }
})

//From profile/index.tsx I pass in the UserObject Type but I have made all the
//properties in UserProfileResponse Object optional so it still works here
export default function UserBasicInfo({ user, addFollowBtn = false }: { user: UserProfileResponse | null, addFollowBtn?: boolean }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const router = useRouter();
  // console.log("is this user acc?", user?.isUserAcc)

  return (
    <View style={styles.userInfo}>
      <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
        <Text style={{ color: theme.text, fontSize: 20 }}>{user?.username}</Text>
        <Link href={"/(tabs)/profile/settings"}>
          <FontAwesome name="bars" color={theme.text} size={20} />
        </Link>
      </View>

      <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          {user && user.profile_picture
            ? (<Image src={user.profile_picture} style={styles.dpStyle} />)
            : (<Image source={placeholder} style={styles.dpStyle} />)}
          <Text style={{ color: theme.text, fontSize: 16, marginTop: 10, fontWeight: "600" }}>{user?.first_name} {user?.last_name}</Text>
        </View>
        <View style={{flexDirection: 'column', alignItems: 'center', flex: 1, marginLeft: 20, gap: 0}}>
          <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-between', flex: 1 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: "heavy", color: theme.text }}>{user ? user?.post_count : 0}</Text>
              <Text style={{color: theme.text}}>Posts</Text>
            </View>
            {/* add a link component here instead of pressable */}
            <Pressable onPress={() => {
              user?.isUserAcc
              ? router.push(`/(tabs)/profile/network?id=${user?._id}&network=followers`)
              : router.push(`/user/(network)?id=${user?._id}&network=followers`);
              // router.push(`/user/(network)?id=${user?._id}&network=followers`);
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: "heavy", color: theme.text }}>{user ? user?.follower_count : 0}</Text>
                <Text style={{color: theme.text}}>Followers</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => {
              user?.isUserAcc
              ? router.push(`/(tabs)/profile/network?id=${user?._id}&network=following`)
              : router.push(`/user/(network)?id=${user?._id}&network=following`);
              // router.push(`/user/(network)?id=${user?._id}&network=following`);
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: "heavy", color: theme.text }}>{user ? user?.following_count : 0}</Text>
                <Text style={{color: theme.text}}>Following</Text>
              </View>
            </Pressable>
          </View>
          
          {/* follow button */}
          {addFollowBtn && <FollowBtn userPrivacyData={{isUserAcc: user?.isUserAcc || false, followStatus: user?.followStatus || "none", _id: user?._id || '', is_private: user?.is_private || false}} />}
          {!addFollowBtn && <View style={{flexDirection: "row", gap: 8}}>
            <EditProfileBtn />
            <DiscoverPeopleBtn />
          </View>}
        </View>
      </View>

      <View>
        <Text style={{ color: theme.text, fontSize: 16, marginTop: !!user?.bio ? 20 : 0 }}>{user?.bio}</Text>
      </View>
    </View>
  );
}
