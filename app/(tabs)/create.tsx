import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View, useWindowDimensions, Text, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

import { useTheme } from "@/context/themeContext";
import { CustomTheme } from "@/utils/types";

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
    backgroundColor: 'rgba(0,0,0,0.3)',
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

  const { width } = useWindowDimensions();
  const itemSize = width / 3 - 2;
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  const [mediaLibPermission, requestMediaLibPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
    const albumAssets = await MediaLibrary.getAssetsAsync({
      album: fetchedAlbums[0],
      first: 5,
      mediaType: "photo",
      sortBy: "creationTime",
    });
    console.log(fetchedAlbums);
    setAssets(albumAssets.assets);
  }

  useEffect(() => {
    async function askPermissions() {
      const x = await handleContinue();
      console.log("x:", x);
      if(x) {
        getAlbums();
      }
    }
    // getAlbums();
    askPermissions();
  }, []);

  async function handleContinue() {
    const havePermissions = await requestAllPermissions();
    console.log(havePermissions)
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
      <FlatList
        data={assets}
        renderItem={({ item, index }) => (
          <Image key={item.id} source={{ uri: item.uri }} style={{ width: 50, height: 50, margin: 1 }} />
        )}
      />
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}