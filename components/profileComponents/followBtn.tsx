import { useMemo, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/context/themeContext";
import { getData, postData } from "@/utils";
import { CustomTheme, UserProfileResponse } from "@/utils/types";
import { useSelector } from "react-redux";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  followBtnDefault: {
    borderRadius: 8,
    padding: 5,
    alignItems: 'center'
  },
  followBtn: {
    backgroundColor: theme.btn_primary,
  },
  unfollowBtn: {
    borderWidth: 2,
    borderColor: theme.text,
    backgroundColor: "transparent",
  },
  reqBtn: {
    backgroundColor: theme.background_disabled,
    color: "white",
  }
})

export default function FollowBtn({ user }: { user: UserProfileResponse | null }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

  const [followed, setFollowed] = useState((user && user.isFollowing) || false);
  
  return (
    <View style={{width: "100%"}}>
      {user && user.isUserAcc
          ? null
          : !followed
            ? <TouchableOpacity style={{...styles.followBtnDefault, ...styles.followBtn}} onPress={async () => {
              console.log("follow button is pressed")
              // query the backend to follow the user
              const followReq = await getData(`${baseurl}/api/user/${user?.username}/follow`, token);
              const followRes = await followReq?.json();
              console.log(followRes);

              //change the state of the follow button
              if(followRes.success) {
                setFollowed(true);
              }
            }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Follow</Text>
            </TouchableOpacity>
            : user?.is_private
              ? <TouchableOpacity style={{...styles.followBtnDefault, ...styles.reqBtn}} onPress={() => {
                // query the backend to request to follow the user

                //change the state of the follow button to requested
                setFollowed(false);
              }}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>Requested</Text>
              </TouchableOpacity>
              : <TouchableOpacity style={{...styles.followBtnDefault, ...styles.unfollowBtn}} onPress={() => {
                // query the backend to unfollow the user

                //change the state of the follow button
                setFollowed(false);
              }}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>Unfollow</Text>
              </TouchableOpacity>
        }
    </View>
  );
}