import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import Video, {VideoRef} from 'react-native-video';
import { getNavigationBarHeightAsync } from "react-native-android-navbar-height";

import { CustomTheme } from "@/utils/types";
import { useEvent } from "expo";
import { LegendList } from "@legendapp/list";
import { FlatList } from "react-native-gesture-handler";
import { TABBAR_HEIGHT } from "@/contants/values";
import { useTheme } from "@/hooks/useTheme";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const reels = [
  {
    id: 1,
    url: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/1.mp4",
    caption: "Judge the skipping skills of this chick 😜",
    like_count: 89,
    comment_count: 12
  },
  {
    id: 2,
    url: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/2.mp4",
    caption: "The city skyline is really pretty at night 🌙",
    like_count: 35,
    comment_count: 2
  },
  {
    id: 3,
    url: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/3.mp4",
    caption: "Throwback to last winter ❄️",
    like_count: 22,
    comment_count: 20
  },
  {
    id: 4,
    url: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/4.mp4",
    caption: "",
    like_count: 200,
    comment_count: 52
  },
  {
    id: 5,
    url: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4",
    caption: "#fyp",
    like_count: 2,
    comment_count: 0
  }
];


export default function Reels() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  // const videoRef = useRef<VideoRef>(null);
  
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width, height } = useWindowDimensions();
  let navigationBarHeight: number;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<{[key: string]: VideoRef}>({});
  const currentPage = useRef(0);

  useEffect(() => {
    (async () => {
      navigationBarHeight = await getNavigationBarHeightAsync();
      // console.log("insets are:", navigationBarHeight / scale, navigationBarHeight, scale);
    })();
  }, []); 

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        // recycleItems={true}
        pagingEnabled={true}
        renderItem={({ item, index }) => {
          return (
            <Video
              source={{ uri: item.url }}
              // ref={videoRef}
              //60 is the height of the tab bar
              style={{ width: width, height: height-TABBAR_HEIGHT-navigationBarHeight }} //-23.5
              resizeMode="cover"
              repeat={true}
            />
          );
        }}
      />
    </View>
  );
}