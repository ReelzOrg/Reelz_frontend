import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions, Text, Alert, FlatList, ScrollView } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import Video from "react-native-video";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { CustomTheme } from "@/utils/types";
import { navigateBack } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import InlineDropdown from "@/components/DropDown";
import { SizedBox } from "@/components";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  middleRowBtns: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
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
    flexDirection: 'row',
    justifyContent: "space-between"
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

  const [selectedImage, setSelectedImage] = useState<MediaLibrary.Asset[]>([]);
  const [selectMultiple, setSelectMultiple] = useState<boolean>(false);
  // const [selectedImages, setSelectedImages] = useState<{id:string, uri: string, fileType: string}[]>([]);

  //the first index will have the entire list of all the albums available and
  //the second index will have the name of the selected album
  const [selectedAlbum, setSelectedAlbum] = useState<[MediaLibrary.Album[], string]>([[], ""]);

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
      return "image"
    if(filename.split(".")[1] == "png") return "image/png"
    
    //add gifs too
    
    return "video"
  }

  async function changeAssets(album: MediaLibrary.Album) {
    // console.log("assets changed")
    //selectedAlbum[0].find((album) => album.title == selectedAlbum[1])
    const albumAssets = await MediaLibrary.getAssetsAsync({
      album: album,
      first: 40,
      mediaType: ["photo", "video"],
      sortBy: "creationTime",
    });

    setAssets(albumAssets.assets);
    if(selectMultiple) setSelectedImage([...selectedImage, albumAssets.assets[0]]);
    else setSelectedImage([albumAssets.assets[0]])
  }

  //select the album with the most assests
  async function getAlbums() {
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
    const largestAlbumIndex = getLargestAlbum(fetchedAlbums);
    setSelectedAlbum([fetchedAlbums, fetchedAlbums[largestAlbumIndex].title]);

    await changeAssets(fetchedAlbums[largestAlbumIndex])
    // const albumAssets = await MediaLibrary.getAssetsAsync({
    //   album: fetchedAlbums[largestAlbumIndex],
    //   first: 40,
    //   mediaType: ["photo", "video"],
    //   sortBy: "creationTime",
    // });
    // // console.log("fetched assets are:", fetchedAlbums);
    // // console.log(albumAssets);
    // setAssets(albumAssets.assets);
    // setSelectedImage({id: albumAssets.assets[0].id, uri: albumAssets.assets[0].uri, fileType: getFileType(albumAssets.assets[0].filename)});
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
    // console.log("have permissions:", havePermissions);
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
          <Text style={{color: theme.text}}>Loading...</Text>
        </View>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* close and next button */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 8}}>
        <TouchableOpacity onPress={() => navigateBack({router, pushOrReplace: 'replace'})}>
          <FontAwesome name="close" size={30} style={{color: theme.text}} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          //go to the next step in posting a image
          console.log(selectedImage.map((item) => item.uri));
          selectMultiple
          ? router.push({
            pathname: '/postContent/newpost',
            // params: selectedImage
            params: {selectedMedia: JSON.stringify(selectedImage.map(item => item))}
          })
          : router.push({
            pathname: '/postContent/newpost',
            params: {selectedMedia: JSON.stringify(selectedImage)}
          })
        }}>
          <Text style={{color: theme.text, fontSize: 30}}>Next</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{margin: 1}}>
        {/* show selected image(s) */}
        {selectedImage.length == 1
        ? selectedImage[0].filename.split(".")[1] == "jpg" || selectedImage[0].filename.split(".")[1] == "jpeg" || selectedImage[0].filename.split(".")[1] == "png"
          ? <Image source={{ uri: selectedImage[0]?.uri }} style={{height: height/2.5}} resizeMode="cover" />
          : <Video source={{ uri: selectedImage[0]?.uri }} style={{height: height/2.5}} resizeMode="cover" />
        // : <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
        //   {selectedImage.map((item, index) => (
        //     <Image key={index} source={{ uri: item.uri }} style={{width: width/2, height: height/4, margin: 1}} resizeMode="cover" />
        //   ))}
        // </View>
        : <FlatList
          data={selectedImage}
          horizontal={true}
          renderItem={({item, index}: {item: {id:string, uri: string, filename: string}, index: number}) => (
            item.filename.split(".")[1] == "jpg" || item.filename.split(".")[1] == "jpeg" || item.filename.split(".")[1] == "png"
              ? <Image key={index} source={{ uri: item.uri }} style={{width: width*2/3, height: height/2.5, margin: 8}} resizeMode="cover" />
              : <Video key={index} source={{ uri: item.uri }} style={{width: width*2/3, height: height/2.5, margin: 8}} resizeMode="contain" />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        }
        
        {/* album dropdown & select multiple images button*/}
        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
          <InlineDropdown
            optionsList={selectedAlbum[0].map((album) => album.title)}
            onSelect={(item) => {
              setSelectedAlbum([selectedAlbum[0], item]);
              changeAssets(selectedAlbum[0].find((album) => album.title == item)!);
            }}
            initialValue={selectedAlbum[1]}
          />

          {/* multiple images button */}
          <TouchableOpacity onPress={() => {
            //if the button was true before then remove all the images from the
            //selectedImage array but the first one
            if(selectMultiple) {
              setSelectedImage([selectedImage[0]]);
            }
            setSelectMultiple(!selectMultiple);
          }}>
            <View style={{...styles.middleRowBtns, backgroundColor: selectMultiple ? 'white' : 'black'}}>
              <FontAwesome name="copy" size={20} style={{marginRight: 5, color: selectMultiple ? 'black' : 'white'}} />
              <Text style={{color: selectMultiple ? 'black' : 'white', fontWeight: '600' }}>
                Select Multiple
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* if you use Legend list here and click on any image, then even though we change the selectedImage
        properties and the entire component re-renders, but the LegendList does not re-render and hence the
        overlay doesnt shift to the selected image 
         */}
        <FlatList
          data={assets}
          // horizontal={true}
          keyExtractor={(item) => item.id}
          // recycleItems={true}
          numColumns={numColumns}
          renderItem={({ item, index }) => { //:LegendListRenderItemProps<MediaLibrary.Asset>
            // console.log("something") <-- this will not log anything in the console if using LegendList
            return (
            <TouchableOpacity
            onPress={() => {
              //first check if the image is already in the list
              if(selectedImage.find((image) => image.id === item.id)) {
                setSelectedImage(selectedImage.filter((image) => image.id !== item.id));
                return;
              }

              console.log("The file type of selected image is:", item.mediaType)

              selectMultiple
              ? setSelectedImage([...selectedImage, item])
              : setSelectedImage([item])
              // setSelectedImage({id: item.id, uri: item.uri, fileType: getFileType(item.filename)})
            }}>
              <View style={{position: 'relative'}}>
                {/* {item.mediaType == "photo"
                  ? <Image key={item.id} source={{ uri: item.uri }} style={{ width: itemSize, height: itemSize, margin: 1 }} />
                  : <Video key={item.id} source={{ uri: item.uri }} style={{ width: itemSize, height: itemSize, margin: 1 }} />
                } */}
                <Image key={item.id} source={{ uri: item.uri }} style={{ width: itemSize, height: itemSize, margin: 1 }} />
                {selectedImage.find((image) => image.id === item.id) && (
                  <View style={styles.selectedOverlay}>
                    <SizedBox />
                    <FontAwesome name="check-circle" size={20} style={{color: 'white', marginTop: 8, marginRight: 8}} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            );
          }}
        />
      </View>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}