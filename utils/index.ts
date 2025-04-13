// import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";
import { AnyListenerPredicate } from "@reduxjs/toolkit";

// const checkIfUserIsValid = async () => {
//   const isValid = await GoogleSignin;
//   if (isValid) {
//     // navigate to your main screens
//   } else {
//     try {
//       await GoogleSignin.signInSilently();
//     } catch (err: any) { console.log("Error", err.code);}
//   }
// };

//Network Requests
export async function postData(url: string, data: {}, token?: string | null, contentType: 'application/json' | 'multipart/form-data' = "application/json") {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorrization': token != null || token != undefined ? `Bearer ${token}` : "",
      'Content-Type': contentType
    },
    body: JSON.stringify(data)
  });

  const response = await result.json()

  return response;
}

export async function getData(url: string, token?: string | null) {
  try {
    const result = await fetch(url, {
      headers: {
        'Authorization': token != null || token != undefined ? `Bearer ${token}` : "",
        'Content-Type': 'application/json'
      }
    });
    if(!result.ok) {
      console.log(result.status, result.statusText)
    }
    return result;
  } catch (err) {
    console.log(err)
  }
}

// PERMISSIONS
// Request camera and gallery permissions
export const requestPermissions = async () => {
  // Request Camera Permission
  const cameraStatus = await Camera.requestCameraPermissionsAsync();
  // setPermissions({...permissions, cameraPermission: cameraStatus.status === 'granted'});
  // Request Media Library (Gallery) Permission
  const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
  // setPermissions({ galleryPermission: galleryStatus.status === 'granted', cameraPermission: cameraStatus.status === 'granted' });

  if (cameraStatus.status !== 'granted' || galleryStatus.status !== 'granted') {
    Alert.alert(
      'Permissions Required',
      'Camera and Gallery access is required to use this feature.',
      [{ text: 'OK' }]
    );
  }

  return { cameraPermission: cameraStatus.status === 'granted', galleryPermission: galleryStatus.status === 'granted' };
};

// HARDWARE
export const openCamera = async (hasCameraPermission: boolean, setImage: React.Dispatch<React.SetStateAction<{
  fileSize: number;
  mimeType: string;
  uri: string;
  width: number;
  height: number;
}>>) => {
  if (!hasCameraPermission) {
    Alert.alert('Permission Denied', 'Camera access is not granted.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.5,
    allowsEditing: true,
  });

  if (!result.canceled) {
    const imgData = result.assets[0];
    setImage({
      fileSize: imgData.fileSize || 0,
      width: imgData.width, height: imgData.height,
      mimeType: imgData.mimeType || "",
      uri: imgData.uri
    })
  }
};

export const openGallery = async (hasGalleryPermission: boolean, setImage: React.Dispatch<React.SetStateAction<{
  fileSize: number;
  mimeType: string;
  uri: string;
  width: number;
  height: number;
}>>, mediaTypes: ImagePicker.MediaType[] = ["images", "livePhotos"]) => {
  if (!hasGalleryPermission) {
    Alert.alert('Permission Denied', 'Gallery access is not granted.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaTypes, // Options: 'images', 'videos', 'all'
    allowsEditing: true,
    quality: 0.5, //idc about the quality of the profile photo
  });

  if (!result.canceled) {
    const imgData = result.assets[0];
    setImage({
      fileSize: imgData.fileSize || 0,
      width: imgData.width, height: imgData.height,
      mimeType: imgData.mimeType || "",
      uri: imgData.uri
    })
  }
};

//Basic validity
export function isPasswordValid(password: string): Boolean {
  const regex: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_~`+-.?":{}|<>]).{8,50}$/;
  return regex.test(password);
}

export function isEmailValid(email: string): Boolean {
  const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return regex.test(email);
}

// S3 functions
export async function uploadImagetoS3(imgUrl: string, imgName: string, fileType: string) {
  try {
    const res = await fetch("http://10.0.0.246:3000/api/upload", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: imgName,
        fileType: fileType
      })
    });

    const uploadUrls = await res.json();
    console.log("upload url is:", uploadUrls);

    const image = await fetch(imgUrl);
    // const image = await fetch(uploadUrls["fileURL"])
    const blob = await image.blob();

    const uploadResponse = await fetch(uploadUrls["uploadURL"], {
      method: 'PUT',
      body: blob,
      headers: {'Content-Type': fileType},
    });

    if (uploadResponse.ok) {
      console.log('Uploaded successfully');
      return {uploaded: true, userImgURL: uploadUrls["fileURL"]};
    } else {
      console.error('Upload failed');
      const result = await uploadResponse.text();
      console.log(result);
    }
  } catch(err) {
    console.log(`Error while uploading the file:`, err);
    return {uploaded: false, userImgURL: null};
  }
}

//Math
export function getMin(x: Float, y: Float): Float {
  return x > y ? y : x;
}

export function getMax(x: Float, y: Float): Float {
  return x > y ? x : y;
}

export const debounce = (func: Function, delay: number) => {
  let timeoutId: any;

  return (...args: any) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};