import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Image, Text, TextInput, TouchableOpacity, useWindowDimensions, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import Video from "react-native-video";

import { navigateBack, postData, uploadImagetoS3, uploadManyToS3, uploadTextAndMedia } from "@/utils";
import { CustomTheme, MediaData } from "@/utils/types";
import { useTheme } from "@/hooks/useTheme";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  mediaDisplay: {
    marginLeft: 8,
    marginTop: 8,
    borderWidth: 2,
    borderColor: theme.text,
    borderRadius: 5
  }
});

export default function NewPost() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const router = useRouter();

  // let { imgUri, id, originalName } = useLocalSearchParams();
  // imgUri = (imgUri as string).split(",").length == 1 ? imgUri : (imgUri as string).split(",");
  // id = (id as string).split(",").length == 1 ? id : (id as string).split(",");
  // originalName = (originalName as string).split(",").length == 1 ? originalName : (originalName as string).split(",");
  const {selectedMedia}: {selectedMedia: string} = useLocalSearchParams();
  const postMedia: MediaLibrary.Asset[] = JSON.parse(selectedMedia);
  
  //if the user sends in the same media file (i.e file with same name) multiple times
  //this variable will help generate a random number to prevent same file names
  let sameMediaCount = 0;

  console.log("The file type & submediatype of 0th index is", postMedia[0].mediaType, postMedia[0].mediaSubtypes);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const _id = useSelector((state: any) => state.user._id);
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  
  const { width, height } = useWindowDimensions();
  const imgHeight = useMemo(() => height / 3, [height]);
  const [caption, setCaption] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 14 }}>
      <View style={{}}>
        <ScrollView>
          <View style={{}}>
            {/* top bar */}
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <TouchableOpacity onPress={() => navigateBack({ router, pushOrReplace: 'replace' })}>
                <FontAwesome name="arrow-left" size={30} style={{ color: theme.text }} />
              </TouchableOpacity>
              <Text style={{ color: theme.text, fontSize: 25 }}>New Post</Text>
            </View>

            {/* show image(s) & caption */}
            <View style={{ alignItems: 'center' }}>
              {postMedia.length == 1
                ? postMedia[0].mediaType == "photo"
                  ? <Image source={{ uri: postMedia[0].uri }} width={imgHeight * 4 / 5} height={imgHeight} resizeMode="cover" />
                  : postMedia[0].mediaType == "video"
                    ? <Video source={{ uri: postMedia[0].uri }} style={{width: imgHeight * 4 / 5, height: imgHeight}} resizeMode="cover" /> : <></>
                : <FlatList
                  data={postMedia}
                  horizontal={true}
                  renderItem={({ item, index }) => (
                    <View style={{position: "relative"}}>
                      {item.mediaType == "video" && <Video key={index} source={{ uri: item.uri }} style={{...styles.mediaDisplay, width: imgHeight * 4 / 5, height: imgHeight}} resizeMode="contain" />}
                      {item.mediaType == "photo" && <Image key={index} source={{ uri: item.uri }} style={styles.mediaDisplay} width={imgHeight * 4 / 5} height={imgHeight} resizeMode="cover" />}
                      <TouchableOpacity
                      style={{position: "absolute", top: 20, right: 14, zIndex: 1, borderRadius: 40, backgroundColor: "rgba(127, 127, 127, 0.5)", paddingVertical: 5, paddingHorizontal: 8}}
                      onPress={() => {
                        //change the imgUri variable to a state variable
                        console.log("Tried to remove an image/video")
                      }}>
                        <FontAwesome name="trash" size={24} style={{color: "white"}} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              }
              {/* <Image source={{ uri: typeof imgUri == "string" ? imgUri : imgUri[0] }} width={height * 4 / 5} height={imgHeight} resizeMode="contain" /> */}
              <TextInput
                value={caption}
                placeholder="Write a caption ..."
                style={{ borderWidth: 1, borderColor: theme.text, width: '100%', marginTop: 20, color: theme.text }}
                onChangeText={(e: string) => {
                  setCaption(e);
                }}
                placeholderTextColor={theme.placeholder}
              />
            </View>
          </View>
        </ScrollView>

        {/* Post Button */}
        <TouchableOpacity onPress={async () => {
          let userPost
          if (postMedia.length == 1) {
            //id is the name of the image in the users device
            userPost = await uploadImagetoS3({
              uri: postMedia[0].uri,
              name: `post_${postMedia[0].id}-${sameMediaCount++}`,
              mimeType: postMedia[0].mediaType == "photo" ? "image/jpeg" : "video/mp4"
            }, { caption: caption, mediaUrl: "" }, `${baseurl}/api/user/${_id}/save-post-media`, token);

            // const userPost = await uploadTextAndMedia(
            //   `${baseurl}/api/user/${_id}/save-post-media`,
            //   postMedia.map((post) => ({ uri: post.uri, name: `post_${post.id}`, mimeType: post.mediaType == "photo" ? "image/jpeg" : "video/mp4" })),
            //   {caption: caption, mediaUrl: []},
            //   token
            // );
            console.log(userPost);

            // if (userPost?.uploaded) {
              //BACKEND
              //we first created a post, updated the post count and set a blank media_url in the media table
              //then we fetched the signedurl and updated the media_ur column with it

              //FRONTEND
              //we get the signed url in the above funtion and upload it directly to the s3 bucket
              //now here we get the response. We dont have to do anything here except for give user some
              //feedback if the file was uploaded or not & switch to another route

              // router.replace('/(tabs)/profile');
            // }
          } else {
            //TODO: Change this to accept a list of objects instead of an object of lists
            userPost = await uploadManyToS3({
              uri: postMedia.map((post) => post.uri),
              mimeType: postMedia.map((post) => post.mediaType == "photo" ? "image/jpeg" : "video/mp4"),
              name: postMedia.map((post) => `post_${post.id}-${sameMediaCount++}`)
            },
              // postMedia.map((post) => ({ uri: post.uri, name: `post_${post.id}`, mimeType: post.mediaType == "photo" ? "image/jpeg" : "video/mp4" })),
              `${baseurl}/api/user/${_id}/save-post-media`, { caption: caption, mediaUrl: [] }, token);
            // const userPost = await uploadTextAndMedia(
            //   `${baseurl}/api/user/${_id}/save-post-media`,
            //   postMedia.map((post) => ({ uri: post.uri, name: `post_${post.id}`, mimeType: post.mediaType == "photo" ? "image/jpeg" : "video/mp4" })),
            //   {caption: caption, mediaUrl: []},
            //   token
            // );
            console.log("THIS IS THE RESPONSE FROM uploadManyToS3", userPost)
          }

          if(userPost?.uploaded) {
            //make a post request to notify the backend
            //i will get the userImgURL key in the return value from uploadImagetoS3 or uploadManyToS3
            const notifyBackend = await postData(`${baseurl}/api/user/${_id}/process-media`, {toProcessUrls: userPost.userImgURL}, token);
            const backendRes = await notifyBackend?.json();
            console.log("NOTIFY BACKEND RESPONSE", backendRes);
            router.replace("/(tabs)/profile");
          } else {
            router.back();
          }
        }} style={{ backgroundColor: theme.btn_primary, borderRadius: 14, padding: 8, alignItems: "center", zIndex: 2 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '600' }}>Post</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}