import { useEffect, useMemo, useState } from "react";
import { Alert, TouchableOpacity, Image, useWindowDimensions } from "react-native";

import { getMax, openCamera, openGallery, requestPermissions } from "@/utils";
import { placeholder } from "@/contants/assets";
import { SimpleImage } from "@/utils/types";

export default function PressableProfilePhoto({ userProfilePhoto, userProfilePhotoUpdater, imageSize }: { userProfilePhoto: SimpleImage, userProfilePhotoUpdater: React.Dispatch<React.SetStateAction<{
  fileSize: number;
  mimeType: string;
  uri: string;
  width: number;
  height: number;
}>>, imageSize?: number }) {
  const { width } = useWindowDimensions();
  const defaultSize = useMemo(() => (width/2) - 70, [width]);
  const photoSize = useMemo(() => imageSize || getMax(100, defaultSize), [defaultSize, imageSize]);

  const [permissions, setPermissions] = useState({cameraPermission: false, galleryPermission: false});

  useEffect(() => {
    async function getPermissions() {
      const { cameraPermission, galleryPermission } = await requestPermissions();
      setPermissions({ cameraPermission, galleryPermission });
    }

    getPermissions();
  }, []);
    
  return (
    <TouchableOpacity onPress={() => {
      Alert.alert(
        "Select Method",
        "How do you want to select the image?",
        [{
          text: "Take a photo",
          // onPress: () => openCamera(permissions.cameraPermission)
          onPress: () => openCamera(permissions.cameraPermission, userProfilePhotoUpdater)
        },
        {
          text: "Choose from gallery",
          // onPress: () => openGallery(permissions.galleryPermission)
          onPress: () => {
            openGallery(permissions.galleryPermission, userProfilePhotoUpdater)
          }
        }]
      )
    }}>
      {userProfilePhoto.uri
        ? <Image src={userProfilePhoto.uri} resizeMode="contain" borderRadius={getMax(defaultSize / 2, 50)} style={{ width: photoSize, height: photoSize }} />
        : <Image source={placeholder} resizeMode="contain" borderRadius={getMax(defaultSize / 2, 50)} style={{ width: photoSize, height: photoSize }} />
      }
    </TouchableOpacity>
  );
}