import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions, Text, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { LegendList, LegendListRef, LegendListRenderItemProps } from "@legendapp/list"

import { useTheme } from "@/context/themeContext";
import { CustomTheme } from "@/utils/types";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { navigateBack } from "@/utils";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  mediaContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    margin: 1,
  },
  videoIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 4,
  },
  videoText: {
    color: 'white',
    fontSize: 12,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText: {
    color: 'white',
    fontSize: 14,
  }
});

export default function CreateContent() {
  const theme = useTheme();
  const themeMode = useSelector((state: any) => state.theme.mode);
  const styles = createStyles(theme);

  const { width, height } = useWindowDimensions();
  const numColumns = width < 300 ? 3 : 4 /**i.e  width/4 < 75 */
  const itemSize = (width-(numColumns+1)) / numColumns;
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [mediaLibPermission, requestMediaLibPermission] = MediaLibrary.usePermissions();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<{id:string, uri: string, fileType: string}>();
  const [selectMultiple, setSelectMultiple] = useState<boolean>(false);

  function getLargestAlbum(fetchedAlbums: MediaLibrary.Album[]): number {
    let maxCount = 0;
    let albumIndex = 0;
    
    for(let i = 0; i < fetchedAlbums.length; i++) {
      if(fetchedAlbums[i].assetCount > maxCount) {
        maxCount = fetchedAlbums[i].assetCount;
        albumIndex = i;
      }
    }

    return albumIndex;
  }

  function getFileType(filename: string) {
    if(filename.split(".")[1] == "jpg" || filename.split(".")[1] == "jpeg")
      return "image/jpeg"
    if(filename.split(".")[1] == "png") return "image/png"
    
    //add gifs too
    
    return "video/mp4"
  }

  //select the album with the most assests
  async function getAlbums() {
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
    const largestAlbumIndex = getLargestAlbum(fetchedAlbums);

    const albumAssets = await MediaLibrary.getAssetsAsync({
      album: fetchedAlbums[largestAlbumIndex],
      first: 40,
      mediaType: ["photo", "video"],
      sortBy: "creationTime",
    });
    // console.log("fetched assets are:", fetchedAlbums);
    // console.log(albumAssets);
    setAssets(albumAssets.assets);
    setSelectedImage({id: albumAssets.assets[0].id, uri: albumAssets.assets[0].uri, fileType: getFileType(albumAssets.assets[0].filename)});
  }

  useEffect(() => {
    async function askPermissions() {
      const x = await handleContinue();
      if(x) {
        getAlbums();
      }
    }
    // getAlbums();
    askPermissions();
  }, []);

  async function handleContinue() {
    const havePermissions = await requestAllPermissions();
    if (!havePermissions) {
      Alert.alert('Permissions Required', 'Media Library access is required to use this feature. Please give the permissions in the settings');
      return false;
    }
    return true;
  }

  async function requestAllPermissions() {
    const mediaLibPermissionStatus = await requestMediaLibPermission();
    
    return mediaLibPermissionStatus?.granted;
  }

  if(assets.length == 0) {
    // handleContinue();
    // console.log("Handle continue was called")
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: theme.text}}>Permission to access media library is required</Text>
        </View>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 8}}>
        <TouchableOpacity onPress={() => navigateBack({router, pushOrReplace: 'replace'})}>
          <FontAwesome name="close" size={30} style={{color: theme.text}} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          //go to the next step in posting a image
          router.push({
            pathname: '/postContent/newpost',
            params: {imgUri: selectedImage?.uri, id: selectedImage?.id, fileType: selectedImage?.fileType}
          })
        }}>
          <Text style={{color: theme.text, fontSize: 30}}>Next</Text>
        </TouchableOpacity>
      </View>
      <View style={{margin: 1}}>
        <Image source={{uri: selectedImage?.uri}} style={{height: height/2.5}} resizeMode="cover" />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
            setSelectMultiple(!selectMultiple);
          }}>
            <View style={{flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, backgroundColor: selectMultiple ? 'white' : 'black', borderWidth: 1, borderColor: 'white'}}>
              <FontAwesome name="copy" size={20} style={{marginRight: 5, color: selectMultiple ? 'black' : 'white'}} />
              <Text style={{color: selectMultiple ? 'black' : 'white', fontWeight: '600' }}>
                Select Multiple
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <LegendList
          data={assets}
          // horizontal={true}
          keyExtractor={(item) => item.id}
          recycleItems={true}
          numColumns={numColumns}
          renderItem={({ item, index }: LegendListRenderItemProps<MediaLibrary.Asset>) => (
            <TouchableOpacity onPress={() => setSelectedImage({id: item.id, uri: item.uri, fileType: getFileType(item.filename)})}>
              <View style={{position: 'relative'}}>
                <Image key={item.id} source={{ uri: item.uri }} style={{ width: itemSize, height: itemSize, margin: 1 }} />
                {selectedImage?.id === item.id && (
              <View style={styles.selectedOverlay} />
            )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}