import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Image, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { navigateBack, postData, uploadImagetoS3, uploadManyToS3 } from "@/utils";
import { MediaData } from "@/utils/types";
import { useTheme } from "@/hooks/useTheme";

export default function NewPost() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const router = useRouter();

  let { imgUri, id, fileType } = useLocalSearchParams();
  imgUri = (imgUri as string).split(",").length == 1 ? imgUri : (imgUri as string).split(",");
  id = (id as string).split(",").length == 1 ? id : (id as string).split(",");
  fileType = (fileType as string).split(",").length == 1 ? fileType : (fileType as string).split(",");

  const { width, height } = useWindowDimensions();

  const theme = useTheme();
  const _id = useSelector((state: any) => state.user._id);
  // why is the _id undefined
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

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
              {typeof imgUri == "string"
                ? <Image source={{ uri: imgUri }} width={imgHeight * 4 / 5} height={imgHeight} resizeMode="cover" />
                : <FlatList
                  data={imgUri}
                  horizontal={true}
                  renderItem={({ item, index }) => (
                    <View style={{position: "relative"}}>
                      <Image key={index} source={{ uri: item }} style={{marginLeft: 8, marginTop: 8, borderWidth: 2, borderColor: theme.text, borderRadius: 5 }} width={imgHeight * 4 / 5} height={imgHeight} resizeMode="cover" />
                      <TouchableOpacity>
                        <FontAwesome name="trash" size={20} style={{color: theme.text, backgroundColor: "rgb(0, 0, 0, 0.5)", position: "absolute", top: 0, right: 0, zIndex: 1}} />
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
          //update this to handle multiple images
          const mediaType = typeof fileType == "string"
            ? fileType.split("/")[0]
            : fileType.map((type) => type.split("/")[0]);

          if (typeof imgUri == "string") {
            //id is the name of the image in the users device
            const userPost = await uploadImagetoS3({
              uri: imgUri,
              name: `post_${id}`,
              mimeType: mediaType as string
            }, { caption: caption, mediaUrl: "" }, `${baseurl}/api/user/${_id}/save-post-media`, token);

            if (userPost?.uploaded) {
              //BACKEND
              //we first created a post, updated the post count and set a blank media_url in the media table
              //then we fetched the signedurl and updated the media_ur column with it

              //FRONTEND
              //we get the signed url in the above funtion and upload it directly to the s3 bucket
              //now here we get the response. We dont have to do anything here except for give user some
              //feedback if the file was uploaded or not & switch to another route

              router.replace('/(tabs)/profile');
            }
          } else {
            //create another function that will handle multiple images upload
            // imgUri(uri), id(name), fileType(mimeType)
            const userPost = await uploadManyToS3({
              uri: imgUri,
              name: (id as string[]).map((i) => `post_${i}`),
              mimeType: mediaType as string[]
            }, `${baseurl}/api/user/${_id}/save-post-media`, { caption: caption, mediaUrl: [] }, token);

            if(userPost.uploaded) {
              router.replace("/(tabs)/profile");
            }
          }
        }} style={{ backgroundColor: theme.btn_primary, borderRadius: 14, padding: 8, alignItems: "center", zIndex: 2 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '600' }}>Post</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}