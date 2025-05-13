import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { getData } from "@/utils";
import { CustomTheme, UserObject, UserProfileResponse } from "@/utils/types";
import TabSwitch from "@/components/profileComponents/TabSwitch";
import UserBasicInfo from "@/components/profileComponents/basicInfo";
import { ShowPosts } from "@/components";
import { useTheme } from "@/hooks/useTheme";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});

//Maybe make a request to fetch the basic user details when the app launches and store
//those details in cache (we might have to build some logic to get the updated data after a while)
//when user opens the user profile page(this page) jsut fetch the posts and reels
export default function Profile() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const user = {...useSelector((state: any) => state.user), isUserAcc: true};
  // console.log("the user is:", user)
  
  //if the user just loggedin then we could use the user saved in the redux store but most of the time
  //the user might be already loggedin so we will have to fetch the data from the server
  // const initialUser: UserObject = useSelector((state: any) => state.user);
  // const [user, setUserState] = useState<UserProfileResponse | null>(null);
  const [posts, setPosts] = useState([]);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    async function getUserData() {
      //make a request to user/posts to fetch only the posts
      // const url = `${baseurl}/api/user/me`;
      const url = `${baseurl}/api/user/posts`;
      const userPosts = await getData(url, token);
      const data = await userPosts?.json();
      // setUserState({...data.user, isUserAcc: true});
      setPosts(data.posts);
      // dispatch(setUser(data.user));
    }

    //get the data from the redux store
    //add an if condition here to check the user variable and if the user is null then get the data
    //from the redux store
    getUserData();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>

          {/* User Profile Info */}
          <UserBasicInfo user={user} />

          {/* User Posts and Reels */}
          <View style={{width: '100%'}}>
            <TabSwitch>
              {/* We are doing overfetching here since we only want the post id
              and the media url(s) instead of the entire post and media objects */}
              <ShowPosts data={posts} numColumns={3} />
            </TabSwitch>
          </View>
        </View>
      </ScrollView>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

/**
 * post data example:
 * [
  {
    "id": 1,
    "user_id": 123,
    "caption": "Enjoying the beach day! 🏖️",
    "created_at": "2023-07-15T09:30:00Z",
    "updated_at": null,
    "like_count": 42,
    "comment_count": 5,
    "media_items": [
      {
        "id": 101,
        "url": "https://your-bucket.s3.amazonaws.com/posts/1/beach.jpg",
        "type": "image",
        "width": 1080,
        "height": 1350
      },
      {
        "id": 102,
        "url": "https://your-bucket.s3.amazonaws.com/posts/1/sunset.jpg",
        "type": "image",
        "width": 1080,
        "height": 810
      }
    ]
  },
  {
    "id": 2,
    "user_id": 123,
    "caption": "Check out my new video!",
    "created_at": "2023-07-14T18:15:00Z",
    "updated_at": null,
    "like_count": 89,
    "comment_count": 12,
    "media_items": [
      {
        "id": 201,
        "url": "https://your-bucket.s3.amazonaws.com/posts/2/video.mp4",
        "type": "video",
        "width": 1920,
        "height": 1080,
        "duration": 60
      }
    ]
  },
  {
    "id": 3,
    "user_id": 123,
    "caption": "Throwback to last winter ❄️",
    "created_at": "2023-07-10T12:00:00Z",
    "updated_at": null,
    "like_count": 35,
    "comment_count": 2,
    "media_items": [] // Empty array for posts with no media
  }
  // ... up to 9 posts
]
 */