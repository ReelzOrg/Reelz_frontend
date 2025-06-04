import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar"
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView } from "react-native-gesture-handler";

import { StoryView, SizedBox } from "@/components";
import { Link, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { CustomTheme } from "@/utils/types";
import { useTheme } from "@/hooks/useTheme";
import { getData, postData } from "@/utils";
import { clearViewedPosts, setUser } from "@/state/slices";
import PostView from "@/components/PostView";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});

export default function Index() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useSelector((state: any) => state.user);
  const viewedPosts = useSelector((state: any) => state.viewedPosts);
  
  useEffect(() => {
    async function getUserData() {
      const loggedInUser = await getData(`${baseurl}/api/user`, token);
      const userData = await loggedInUser?.json();
      dispatch(setUser(userData.user[0]));
    }

    if(!user.username) {
      getUserData();
    }

    //check the viewedPostsSlice if there are any pending records, send them to server
    //this is needed becuase when user pull refreshes the page the already viewed posts
    //should not be seen again
  }, [user]);

  useEffect(() => {
    async function saveViewedPosts(user_id: string) {
      const savedPosts = await postData(`${baseurl}/api/user/${user_id}/save-viewed-posts`, {viewedPosts}, token);
      const data = await savedPosts?.json();

      console.log("Did we save the viewed posts?", data);
      if(data.success) {
        //clear the viewed posts in redux store
        dispatch(clearViewedPosts());
      }
    }

    let userId = user._id;
    if(userId && viewedPosts.length > 0) {
      console.log("We just ran the first fetch request to save viewed posts")
      saveViewedPosts(userId);
    }
  }, []);

  const unsentPosts = useRef<string[]>([]); // Track posts not yet sent

  // 1. Accumulate viewed posts without sending
  useEffect(() => {
    if (viewedPosts.length > 0) {
      unsentPosts.current = [...new Set([...unsentPosts.current, ...viewedPosts])];
    }
  }, [viewedPosts]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log("This should print after a tab switch")
        if(unsentPosts.current.length > 0) {
          //make the request to store the viewed posts
          sendViewedPosts(unsentPosts.current);
          unsentPosts.current = []; // Clear after sending
          dispatch(clearViewedPosts());
        }
      }
    }, [])
  );

  async function sendViewedPosts(posts: string[]) {
    console.log("Are we really running this function?")
    const savedPosts = await postData(`${baseurl}/api/user/${user._id}/save-viewed-posts`, {viewedPosts: posts}, token);
    const data = await savedPosts?.json();

    console.log("Did we save the viewed posts? (2)", data);
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1}}>
      {/* <ScrollView> */}
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 20 }}>
        <View style={{paddingHorizontal: 20}}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{color: "white", fontSize: 20}}>Reelz</Text>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <Link href={"/notifications"}>
              <FontAwesome name="heart-o" size={24} color={theme.text} />
            </Link>
            <Link href={"/messages"}>
              <FontAwesome name="envelope-o" size={24} color={theme.text} />
            </Link>
          </View>
        </View>
        <SizedBox height={14} />

        {/* Story View */}
        <ScrollView horizontal={true}>
          <StoryView />
        </ScrollView>
        <SizedBox height={14} />
        </View>

        {/* User Feed */}
        <PostView />
      </View>
      {/* </ScrollView> */}
      <StatusBar style={theme.mode == 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
