import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, ViewToken } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LegendList } from "@legendapp/list";

import { getData } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import { SinglePostView } from "@/components";
import { addViewedPost } from "@/state/slices";

export default function PostView() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [feed, setFeed] = useState([
    {"feed_items": [{
      "post": {
        "_id": "",
        "caption": "",
        "comment_count": 0,
        "created_at": "",
        "like_count": 0,
        "share_count": 0,
        "user_id": "",
        "media_items": []
      },
      "relevance_score": 0,
      "user": {
        "_id": "",
        "first_name": "",
        "last_name": "",
        "profile_picture": "",
        "username": ""
      }
    }]}
  ]);
  const viewedTimers = useRef<Record<string, NodeJS.Timeout>>({}); // Track timers per component
  const viewedItems = useRef(new Set()); // Track already processed items

  useEffect(() => {
    async function getUserFeed() {
      const feedResponse = await getData(`${baseurl}/api/user/feed`, token);
      const feedData = await feedResponse?.json();
      if(feedData.success) setFeed(feedData.feed);
    }

    getUserFeed();
  }, []);
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Trigger when 50% of item is visible
    minimumViewTime: 750, // Wait 3/4 second
    waitForInteraction: false
  });

  //Also save the time when the user viewed the posts
  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    Object.keys(viewedTimers.current).forEach(postId => {
      console.log("This is the postid we might be deleting timer for:", postId)
      if (!viewableItems.some(item => {
        console.log(item, postId);
        return item.item.id === postId
      })) {
        clearTimeout(viewedTimers.current[postId]);
        delete viewedTimers.current[postId];
      }
    });

    // Set timers for newly visible items
    viewableItems.forEach(({ item, isViewable }) => {
      const postId = item.feed_items[0].post._id;
      
      if (isViewable && !viewedTimers.current[postId] && !viewedItems.current.has(postId)) {
        viewedTimers.current[postId] = setTimeout(() => {
          //Mark as viewed
          viewedItems.current.add(postId);
          
          //store the viewed post
          storePostView(postId);
          console.log("This post is viewed:", postId);

          //clean up the timer
          delete viewedTimers.current[postId];
        }, 1000);
      }
    });
    }
  ).current;

  function storePostView(post_id: string) {
    post_id && dispatch(addViewedPost(post_id));
  }

  return (
    <FlatList
      data={feed}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig.current}
      onViewableItemsChanged={handleViewableItemsChanged}
      ListEmptyComponent={
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: theme.text}}>There are no new posts to view</Text>
          <Text style={{color: theme.text}}>Follow more people to get new Posts</Text>
        </View>
      }
      renderItem={({ item, index }: { item: any, index: number }) => {
        return <SinglePostView
          username={item.feed_items[0].user.username}
          userDP={item.feed_items[0].user.profile_picture}
          post={item.feed_items[0].post}
        />
      }}
    />
  );
}