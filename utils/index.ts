// import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { AnyListenerPredicate } from "@reduxjs/toolkit";
import { Href, Router } from "expo-router";
import { MediaData, MultiMediaData } from "./types";

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
  try {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': token != null || token != undefined ? `Bearer ${token}` : "",
      'Content-Type': contentType
    },
    body: JSON.stringify(data)
  });
  return result;
  } catch (err) {
    console.log("This POST request is the problem:", url);
    console.log(err);
    return null;
  }

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
    console.log("this request is not going through:", url);
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
  mimeType: string;
  uri: string;
}>>, quality: number = 0.3) => {
  if (!hasCameraPermission) {
    Alert.alert('Permission Denied', 'Camera access is not granted.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: quality,
    allowsEditing: true,
  });

  if (!result.canceled) {
    const imgData = result.assets[0];
    setImage({
      mimeType: imgData.mimeType || "",
      uri: imgData.uri
    })
  }
};

export const openGallery = async (hasGalleryPermission: boolean, setImage: React.Dispatch<React.SetStateAction<{
  mimeType: string;
  uri: string;
}>>, mediaTypes: ImagePicker.MediaType[] = ["images", "livePhotos", "videos"], quality: number = 0.3) => {
  if (!hasGalleryPermission) {
    Alert.alert('Permission Denied', 'Gallery access is not granted.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaTypes, // Options: 'images', 'videos', 'all'
    allowsEditing: true,
    quality: quality,
  });

  if (!result.canceled) {
    const imgData = result.assets[0];
    setImage({
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
const uploadProgress = (written: any, total: any) => {
  console.log(`Uploaded: ${(written / total) * 100}%`);
};
//TODO: change this function to handle video files as well
//TODO: Stream bigger image data
export async function uploadImagetoS3(mediaData: MediaData, otherData?: any, url?: string, token?: string) {
  let uploadUrl: string = url || "http://10.0.0.246:3000/api/auth/register/upload-profile-photo";
  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': token != null || token != undefined ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: mediaData.name,
        fileType: mediaData.mimeType,
        ...otherData
      })
    });

    const uploadUrls = await res.json();
    console.log("upload url is:", uploadUrls);
    if(uploadUrls.success == false) return {uploaded: false, userImgURL: null};

    const image = await fetch(mediaData.uri);
    // const image = await fetch(uploadUrls["fileURL"])
    let uploadResponse;
    if(mediaData.mimeType == "video") {
      const fileInfo: FileSystem.FileInfo = await FileSystem.getInfoAsync(mediaData.uri);
      if(fileInfo.exists) {
        if (fileInfo.size > 500 * 1024 * 1024) { // 500MB limit
          throw new Error('Video too large');
        }
      }

      const uploadResult = await FileSystem.uploadAsync(uploadUrls["uploadURL"], mediaData.uri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: { 'Content-Type': 'video/mp4' },
        // onUploadProgress: uploadProgress
      });
      console.log('Upload success:', uploadResult);
    } else if(mediaData.mimeType == "image") {
      const blob = await image.blob();
  
      uploadResponse = await fetch(uploadUrls["uploadURL"], {
        method: 'PUT',
        body: blob,
        headers: {'Content-Type': mediaData.mimeType},
      });
    }

    if (uploadResponse && uploadResponse.ok) {
      console.log('Uploaded successfully');

      //send a post request to the backend notifying that the upload has been 
      return {uploaded: true, userImgURL: uploadUrls["fileURL"]};
    } else {
      console.error('Upload failed');
      const result = uploadResponse && await uploadResponse.text();
      console.log(result);
      return {uploaded: false, userImgURL: null}
    }
  } catch(err) {
    console.log(`Error while uploading the file:`, err);
    return {uploaded: false, userImgURL: null};
  }
}

export async function uploadManyToS3(mediaData: MultiMediaData, url: string, otherData?: any, token?: string) {
  async function fetchS3Urls() {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token != null || token != undefined ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: mediaData.name, // ["img1", "video1"]
          fileType: mediaData.mimeType, // ["image/jpeg", "video/mp4"]
          ...otherData
        })
      });

      const uploadUrls = await res?.json();
      if(!uploadUrls.success) return {success: false};

      return uploadUrls;
    } catch (err) {
      console.log("There was an error trying to fetch the s3 urls:", err);
      return;
    }
  }

  const uploadUrls = await fetchS3Urls();
  console.log("The upload urls are:", uploadUrls);

    const uploadPromises = mediaData.uri.map(async (item: string, index: number) => {
      try {
        const uploadResult = await FileSystem.uploadAsync(
          uploadUrls["uploadURL"][index],
          item,
          {
            httpMethod: 'PUT',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            headers: {
              'Content-Type': mediaData.mimeType[index],
            }
          }
        );

        return {
          originalUri: item,
          success: uploadResult.status >= 200 && uploadResult.status < 300
        };
      } catch (err) {
        return { originalUri: item, success: false, err };
      }
    });

    const uploadResults = await Promise.all(uploadPromises);

    const successfulUploads = uploadResults.filter((r: any) => r.success);
    const failedUploads = uploadResults.filter((r: any) => !r.success);

    console.log(`Success: ${successfulUploads.length}, Failed: ${failedUploads.length}`);
    if(successfulUploads.length == mediaData.uri.length) {
      return {uploaded: true, userImgURL: uploadUrls["fileURL"]};
    } else {
      console.log("There was an error uploading 1 or more files:", failedUploads)
      return {uploaded: false, userImgURL: null}
    }

    /*
    let images, blobs;
    try {
      images = await Promise.all(mediaData.uri.map(async (uri) => await fetch(uri)));
      blobs = await Promise.all(images.map(async (image) => await image.blob()));
    } catch (err) {
      console.log(`Error while changing the image to blob:`, err);
      return {uploaded: false, userImgURL: null}
    }

    let uploadResponses;
    try {
      uploadResponses = await Promise.all(blobs.map(async (blob, index) => {
        const uploadResponse = await fetch(uploadUrls["uploadURLs"][index], {
          method: 'PUT',
          body: blob,
          headers: {'Content-Type': mediaData.mimeType[index]},
        });
  
        return uploadResponse.ok;
      }));
    } catch (err) {
      console.log(`Error while uploading blobs to s3`, err);
      return {uploaded: false, userImgURL: null}
    }

    console.log(uploadResponses);
    if (uploadResponses.every((response) => response)) {
      console.log('Uploaded successfully');
      return {uploaded: true, userImgURL: uploadUrls["fileURL"]};
    } else {
      console.error('Upload failed');
      return {uploaded: false, userImgURL: null};
    }
    */
}

/**
 * Uploads text and media to the server (use this function instead of uploadManyToS3 & uploadImagetoS3)
 * @param url The url which will get the presigned s3 url
 * @param mediaData image or video file to be uploaded
 * @param data other data to be sent to the server
 * @param token jwt token
 * @returns 
 */
export async function uploadTextAndMedia(url: string, mediaData: MediaData[], data?: {caption: string, mediaUrl: string[]}, token?: string) {
  //http://10.0.0.246:3000/api/user/44938b73-afca-4cf9-a298-bd6c5a7bda46/save-post-media
  // {"mimeType": ["video", "video", "image"],
  // "name": ["1000000045", "1000000044", "1000000041"],
  // "uri": ["file:///storage/emulated/0/Download/275633_small.mp4", "file:///storage/emulated/0/Download/455059_Santorini_Greece_1280x720.mp4", "file:///storage/emulated/0/Download/image1.jpg"]}
  // {caption: "yo", mediaUrl: []}
  //Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryxyALugcEzim2rQ3u
  const formData = new FormData();

  console.log("URL:", url);

  // 1. Convert URI to Blob
  for (let i = 0; i < mediaData.length; i++) {
    // const blob = await FileSystem.readAsStringAsync(mediaData[i].uri, {
    //   encoding: FileSystem.EncodingType.Base64,
    // }).then(async (base64) => {
    //   const fetchMedia = await fetch(`data:${getMimeType(mediaData[i].uri)};base64,${base64}`).then(res => res.blob());
    //   return fetchMedia;
    // });

    // formData.append('files', blob, mediaData[i].uri.split('/').pop()); // Key 'files' (array)

    formData.append("mediaFiles", {
      uri: mediaData[i].uri,
      type: mediaData[i].mimeType,
      name: mediaData[i].name
    } as any);
  }

  formData.append("caption", data?.caption || "");

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
        // "Content-Type": "multipart/form-data"
      }
    })
    const jsonRes = await response?.json();
    console.log("\n\nTHIS IS THE RESPONSE FROM POSTING TEXT & MEDIA DATA:", jsonRes);
    return jsonRes;
  } catch (err) {
    console.log("There was an error trying to fetch the s3 urls:", err);
    return;
  }
  // const uploadMedia = await FileSystem.uploadAsync(
  //   url,
  //   mediaData.uri,
  //   {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     fieldName: "file",
  //     httpMethod: 'POST',
  //     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
  //   }
  // );
}

const getMimeType = (uri: string) => {
  const extension = uri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
};

//ROUTE HANDLING
export function navigateBack({router, fallbackRoute = "/(tabs)/home", pushOrReplace = "push"}: {router: Router, fallbackRoute?: Href, pushOrReplace?: "push" | "replace"}) {
  if(router.canGoBack()) {
    router.back()
  } else {
    if(pushOrReplace == "push") router.push(fallbackRoute)
    else router.replace(fallbackRoute)
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