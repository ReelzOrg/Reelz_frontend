import { FontAwesome } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@/context/themeContext";
import { navigateBack, postData, uploadImagetoS3 } from "@/utils";
import { MediaData } from "@/utils/types";

export default function NewPost() {
  const router = useRouter();
  const { imgUri, id, fileType } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();

  const theme = useTheme();
  const _id = useSelector((state: any) => {
    console.log("This is the user object:", state.user);
    return state.user._id
  });
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  console.log("the token is:", token)

  const imgHeight = useMemo(() => height/3, [height]);
  const [caption, setCaption] = useState("");

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.background, padding: 14}}>
      <View style={{}}>
      <ScrollView>
      <View style={{}}>
        {/* top bar */}
        <View style={{flexDirection: 'row', alignItems: "center"}}>
          <TouchableOpacity onPress={() => navigateBack({router, pushOrReplace: 'replace'})}>
            <FontAwesome name="arrow-left" size={30} style={{color: theme.text}} />
          </TouchableOpacity>
          <Text style={{color: theme.text, fontSize: 25}}>New Post</Text>
        </View>

        {/* show image & caption */}
        <View style={{alignItems: 'center'}}>
          <Image source={{uri: typeof imgUri == "string" ? imgUri : imgUri[0]}} width={height*4/5} height={imgHeight} resizeMode="contain" />
          <TextInput
            value={caption}
            placeholder="Write a caption ..."
            style={{borderWidth: 1, borderColor: theme.text, width: '100%', marginTop: 20, color: theme.text}}
            onChangeText={(e: string) => {
              setCaption(e);
            }}
            placeholderTextColor={theme.placeholder}
          />
        </View>
      </View>
      </ScrollView>

      <TouchableOpacity onPress={async () => {
          //update this to handle multiple images
          const mediaType = typeof fileType == "string"
          ? fileType.split("/")[0]
          : fileType[0];
          
          //please improve this logic
          //get a presigned aws s3 url
          //get the user id first and add that to the url
          if(typeof imgUri == "string") {
            const userPost = await uploadImagetoS3({
              uri: imgUri,
              name: `post_${id}`,
              mimeType: typeof mediaType == "string" ? mediaType : mediaType[0]
            }, `http://10.0.0.246:3000/api/user/${_id}/save-post-media`, token);

            if(userPost?.uploaded) {
              //we have uploaded the image to s3
              //create a post request to the server to save the post data (this will also increase the post count)
              //the user id will be taken from the api and checked against the jwt token on the server
              let savePost = await postData(`http://10.0.0.246:3000/api/user/${_id}/post/create`, {
                caption: caption,
                mediaUrl: userPost.userImgURL,
                mediaType: mediaType
              }, token);

              console.log("the saved post is:", savePost);
              if(savePost.success) {
                router.replace('/(tabs)/profile');
              }
            }
          } else if(typeof imgUri == "object") {
            //create another function that will handle multiple images upload
          }
        }} style={{backgroundColor: theme.btn_primary, borderRadius: 14, padding: 8, alignItems: "center", zIndex: 2}}>
          <Text style={{color: theme.text, fontSize: 20, fontWeight: '600'}}>Post</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  ); 
}