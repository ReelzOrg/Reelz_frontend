import { Image, View, Text, useWindowDimensions, FlatList, TouchableOpacity, Pressable } from "react-native";
import Video from "react-native-video";

import { placeholder } from "@/contants/assets";
import { useTheme } from "@/hooks/useTheme";
import { MediaItem, PostWithMediaObject } from "@/utils/types";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "expo-router";

export default function SinglePostView({userDP, username, post}:
  {userDP?: string, username?: string, post: PostWithMediaObject}) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  // const flatListRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  //Store all the views in a variable in the redux store, after the user have viewed
  //a certain number of posts or switched to another screen make a request to save
  //these views

  /** This goes in the server, also what is Materialized View (for heavy analytics)
   * async function recordView(userId, postId) {
  // Insert into PostgreSQL (idempotent)
  await query(
    `INSERT INTO usersviewedposts (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,  // No duplicate views
    [userId, postId]
  );
   */

  return (
    <View style={{marginBottom: 40}}>
      <Link href={{
        pathname: '/user/[username]',
        params: {username: username ? username : "Empty User"}
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14}}>
        {userDP
        ? <Image src={userDP} style={{width: 30, height: 30, borderRadius: 16}} />
        : <Image source={placeholder} style={{width: 30, height: 30, borderRadius: 16}} />}
        <View style={{marginLeft: 10}}>
          <Text style={{color: theme.text}}>{username ? username : "Empty user"}</Text>
          {/* add the location or music that the user has added to this post */}
        </View>
      </View>
      </Link>

      {post && post.media_items.length == 1
      ? post.media_items[0].media_type == "image"
        ? <Image src={post.media_items[0].media_url} style={{width: width, height: 5*width/4}} resizeMode="cover" />
        : <Video source={{uri: post.media_items[0].media_url}} style={{width: width, height: 5*width/4}} resizeMode="cover" />
      : <View style={{position: "relative"}}>
      <FlatList
        data={post.media_items}
        // ref={flatListRef}
        keyExtractor={(item, index) => item._id.toString()}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        // viewabilityConfig={viewabilityConfig}
        // onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({item, index}) => (
          item.media_type == "image"
          ? <Image src={item.media_url} style={{width: width, height: 5*width/4}} resizeMode="cover" />
          : <Video source={{uri: item.media_url}} style={{width: width, height: 5*width/4}} resizeMode="cover" />
        )}
      />
      <View style={{position: "absolute", top: 16, right: 16, backgroundColor: "rgba(0,0,0,0.7)", padding: 8, borderRadius: 20}}>
        <Text style={{color: "white"}}>{currentIndex+1}/{post.media_items.length}</Text>
      </View>
      </View>
      }

      {/* likes, comments, shares */}
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', gap: 16, marginTop: 16, marginLeft: 8}}>
        <View style={{flexDirection: 'row', gap: 5}}>
          <TouchableOpacity onPress={() => {
            setLiked(!liked);
          }}>
            <FontAwesome name={liked ? "heart" : "heart-o"} size={24} color={ liked ? "red" : theme.text} />
          </TouchableOpacity>
          <Text style={{color: theme.text}}>{post.like_count}</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 5}}>
          <TouchableOpacity onPress={() => {
            //open the comment section bottom shett

          }}>
            <FontAwesome name="comment-o" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={{color: theme.text}}>{post.comment_count}</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 5}}>
          <TouchableOpacity onPress={() => {
            //open the share bottom shett
          }}>
            <FontAwesome name="share" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={{color: theme.text}}>{post.share_count}</Text>
        </View>
      </View>

      {/* caption */}
      <View style={{marginTop: 16, marginLeft: 8, flexDirection: 'row', gap: 8, justifyContent: 'flex-start'}}>
        <Text style={{color: theme.text, fontWeight: 'bold', fontSize: 16}}>{username ? username : "Empty user"}</Text>
        <Text style={{color: theme.text, fontSize: 16}}>{post.caption}</Text>
      </View>
    </View>
  );
}