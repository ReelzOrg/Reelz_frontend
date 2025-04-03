// import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Float } from "react-native/Libraries/Types/CodegenTypes";

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