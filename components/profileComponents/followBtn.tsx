import { useMemo, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { getData, postData } from "@/utils";
import { CustomTheme } from "@/utils/types";
import { useSelector } from "react-redux";
import { FollowStatus } from "../utils";
import { useTheme } from "@/hooks/useTheme";

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

export default function FollowBtn({ userPrivacyData }: { userPrivacyData: { isUserAcc: boolean, followStatus: "follows" | "none" | "requested" | "blocked", _id: string, is_private: boolean } | null }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const userId = useSelector((state: any) => state.user._id);

  const [followStatus, setFollowStatus] = useState<"follows" | "requested" | "none" | "blocked">(userPrivacyData?.followStatus == undefined ? "none" : userPrivacyData?.followStatus);

  // userPrivacyData?._id is the ID of the requested user whereas userId is the ID of the logged in user
  // we want to make a request with the id of the requested user
  async function handleFollow(status: FollowStatus) {
    let url: string = `${baseurl}/api/user/${userPrivacyData?._id}/`;
    if(status == FollowStatus.NONE) url += "unfollow";
    else url += "follow";
    const followReq = await getData(url, token);
    return await followReq?.json();
  }

  // handle the block status from backend & not show the requested user during
  // the search itself
  return (
    <View style={{width: "100%"}}>
      {userPrivacyData && userPrivacyData?.isUserAcc
        ? null //or show the edit profile button
        : followStatus == "none"
          ? <TouchableOpacity style={{...styles.followBtnDefault, ...styles.followBtn}}
              onPress={async () => {
                const status: FollowStatus = userPrivacyData?.is_private ? FollowStatus.REQUESTED : FollowStatus.FOLLOWS;
                const followRes = await handleFollow(status);

                //set the follow status before making the actual request to the server, make the UI fast
                if(followRes.success) {
                  setFollowStatus(status);
                }
              }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Follow</Text>
          </TouchableOpacity>
          : followStatus == "requested"
            ? <TouchableOpacity style={{...styles.followBtnDefault, ...styles.reqBtn}} onPress={async () => {
                //remove the REQUESTED relationship
                const status: FollowStatus = FollowStatus.NONE;
                const followRes = await handleFollow(status);
                if(followRes.success) {
                  setFollowStatus(status);
                }
              }}>
              <Text style={{ color: theme.text, fontSize: 16 }}>Requested</Text>
            </TouchableOpacity>

            // the logged in user already follows the requested user
            : <TouchableOpacity style={{...styles.followBtnDefault, ...styles.unfollowBtn}} onPress={async () => {
                //remove the FOLLOWS relationship
                const status: FollowStatus = FollowStatus.NONE;
                const followRes = await handleFollow(status);
                setFollowStatus(status);
              }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>Unfollow</Text>
              </TouchableOpacity>
      }
    </View>
  );
}