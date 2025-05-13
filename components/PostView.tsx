import { getData } from "@/utils";
import { LegendList } from "@legendapp/list";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SinglePostView } from "@/components";
import { View, Text } from "react-native";

export default function PostView() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

  const [feed, setFeed] = useState([]);

  useEffect(() => {
    async function getUserFeed() {
      const feedResponse = await getData(`${baseurl}/api/user/feed`, token);
      const feedData = await feedResponse?.json();
      if(feedData.success) setFeed(feedData.feed);
    }

    getUserFeed();
  }, []);

  return (
    // <LegendList
    //   data={feed}
    //   renderItem={({ item, index }) => {
    //     return <SinglePostView

    //     />
    //   }}
    // />
    <View>
      <Text>Whats up?</Text>
    </View>
  );
}