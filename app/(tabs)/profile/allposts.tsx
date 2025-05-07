import React, { useRef, useEffect, useState } from 'react';
import { FlatList, View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PostWithMediaObject } from '@/utils/types';
import { SinglePostView, SizedBox, TopNavBar } from '@/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { TABBAR_HEIGHT } from '@/contants/values';
import { getNavigationBarHeightAsync } from 'react-native-android-navbar-height';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

//from postTab.tsx
export default function AllPosts() {
  const params = useLocalSearchParams();
  const [posts, setPosts] = useState<PostWithMediaObject[]>(JSON.parse(params.posts as string));
  // const flatListRef = useRef<FlatList>(null);

  const theme = useTheme();
  let mobile_navbar=0;
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  // const dim = useWindowDimensions();
  // console.log(dim.width, width)

  // Scroll to initial index when component mounts
  useEffect(() => {
    async function something() {
      mobile_navbar = await getNavigationBarHeightAsync();
    }
    something();
    // setTimeout(() => {
    //   flatListRef.current?.scrollToIndex({
    //     index: Number(params.localPostIndex),
    //     animated: false,
    //   });
    // }, 100); // Small delay to ensure layout is complete
  }, []);

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    // console.log("Media Items array 0th index:", item.media_items[0])
    return (
      // <SinglePostView userDP={user.profile_picture} username={user.username} post={item} />
      <View style={{padding: 20, backgroundColor: "rgb(255, 0, 0, 0.2)", marginBottom: 8}}>
        <Text>{item.caption}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: theme.background}}>
      {/* the +8 here is for the SizedBox we added, 92 */}
    <View style={{backgroundColor: theme.background, marginBottom: TABBAR_HEIGHT+mobile_navbar+8}}>
      {/* <TopNavBar pageTitle="Posts" theme={theme} fallbackRoute={"/(tabs)/profile"} /> */}
      {/* TODO: Fix the back button - Cannot remove child at
      index 13 from parent ViewGroup [462], only 14 children in
      parent. Warning: childCount may be incorrect! */}
      <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 8, backgroundColor: "rgb(0, 0, 0, 0.2)"}}>
        <TouchableOpacity onPress={() => {
          router.replace("/(tabs)/profile");
        }}>
          <FontAwesome name='arrow-left' size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={{color: theme.text, fontSize: 24, fontWeight: "700"}}>Posts</Text>
      </View>
      <SizedBox height={8} />
      <FlatList
        // ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        // pagingEnabled
        showsVerticalScrollIndicator={false}
        // initialScrollIndex={Number(params.localPostIndex)}
        // getItemLayout={(data, index) => ({
        //   length: Dimensions.get('window').height,
        //   offset: Dimensions.get('window').height * index,
        //   index,
        // })}
        // onScrollToIndexFailed={(info) => {
          // Fallback for scroll failure
          // setTimeout(() => {
          //   console.warn(`Failed to scroll to index: ${info.index}`);
          //   flatListRef.current?.scrollToIndex({
          //     index: info.index,
          //     animated: false,
          //   });
          // }, 500);
        // }}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'black',
  },
  fullScreenItem: {
    width: width,
    // height: width*5/4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});