import { useEffect, useMemo, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { getMax, isEmailValid, isPasswordValid, openCamera, openGallery, postData, requestPermissions, uploadImagetoS3 } from "@/utils";
import { placeholder } from "@/contants/assets";
import { useTheme } from "@/context/themeContext";
import { TextField } from "@/components";
import { saveToken } from "@/utils/storage";
import { CustomTheme } from "@/utils/types";
// import { setUser } from "@/state/slices/userSlice";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40
  },
  txtField: {
    borderRadius: 9,
    backgroundColor: theme.background,
  },
});

export default function RegisterScreen() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  // const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [userData, setUserData] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '', imgUrl: ''
  });
  const [userImage, setUserImage] = useState({
    fileSize: 0,
    mimeType: "",
    uri: "",
    width: 0, height: 0,
  })
  const [permissions, setPermissions] = useState({
    cameraPermission: false, galleryPermission: false
  })
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const halfWidth = width / 2;

  useEffect(() => {
    // requestPermissions()
    async function getPermissions() {
      const { cameraPermission, galleryPermission } = await requestPermissions();
      setPermissions({ cameraPermission, galleryPermission });
    }

    getPermissions();
  }, []);

  function handleFormInput(value: string, changedData: string) {
    setUserData({ ...userData, [changedData]: value })
  }

  // const openCamera = async (hasCameraPermission: boolean) => {
  //   if (!hasCameraPermission) {
  //     Alert.alert('Permission Denied', 'Camera access is not granted.');
  //     // requestPermissions();
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     quality: 0.5,
  //     allowsEditing: true,
  //   });

  //   if (!result.canceled) {
  //     const imgData = result.assets[0];
  //     // setUserData({...userData, image: {
  //     //   fileSize: imgData.fileSize || 0,
  //     //   width: imgData.width, height: imgData.height,
  //     //   mimeType: imgData.mimeType || "",
  //     //   uri: imgData.uri
  //     // }});
  //     setUserImage({
  //       fileSize: imgData.fileSize || 0,
  //       width: imgData.width, height: imgData.height,
  //       mimeType: imgData.mimeType || "",
  //       uri: imgData.uri
  //     })
  //   }
  // };

  // Open gallery to choose a photo/GIF
  // const openGallery = async (hasGalleryPermission: boolean) => {
  //   if (!hasGalleryPermission) {
  //     Alert.alert('Permission Denied', 'Gallery access is not granted.');
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ["images", "livePhotos"], // Options: 'images', 'videos', 'all'
  //     allowsEditing: true,
  //     quality: 0.5, //idc about the quality of the profile photo
  //   });

  //   if (!result.canceled) {
  //     // console.log(result.assets[0]);
  //     const imgData = result.assets[0];
  //     // setUserData({...userData, image: {
  //     //   fileSize: imgData.fileSize || 0,
  //     //   width: imgData.width, height: imgData.height,
  //     //   mimeType: imgData.mimeType || "",
  //     //   uri: imgData.uri
  //     // }});
  //     setUserImage({
  //       fileSize: imgData.fileSize || 0,
  //       width: imgData.width, height: imgData.height,
  //       mimeType: imgData.mimeType || "",
  //       uri: imgData.uri
  //     })
  //   }
  // };

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ alignItems: 'center', width: "100%" }}>
            <TouchableOpacity onPress={() => {
              Alert.alert(
                "Select Method",
                "How do you want to select the image?",
                [{
                  text: "Take a photo",
                  // onPress: () => openCamera(permissions.cameraPermission)
                  onPress: () => openCamera(permissions.cameraPermission, setUserImage)
                },
                {
                  text: "Choose from gallery",
                  // onPress: () => openGallery(permissions.galleryPermission)
                  onPress: () => openGallery(permissions.galleryPermission, setUserImage)
                }]
              )
            }}>
              {userImage.uri
                ? <Image src={userImage.uri} resizeMode="contain" borderRadius={getMax((halfWidth - 70) / 2, 50)} style={{ width: getMax(100, halfWidth - 70), height: getMax(halfWidth - 70, 100) }} />
                : <Image source={placeholder} resizeMode="contain" borderRadius={getMax((halfWidth - 70) / 2, 50)} style={{ width: getMax(100, halfWidth - 70), height: getMax(halfWidth - 70, 100) }} />
              }
            </TouchableOpacity>
            <TextField
              value={userData.username}
              onUserInput={(value: string) => handleFormInput(value, "username")}
              theme={theme}
              placeholder="Your username"
              isUsername={true}
              styles={{marginTop: 16}}
            />

            {/* first and last name */}
            <View style={{ flexDirection: 'row', marginTop: 18, width: '100%', maxWidth: 500, justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <TextField
                  value={userData.first_name}
                  onUserInput={(value: string) => handleFormInput(value, "first_name")}
                  theme={theme}
                  label="First Name"
                  placeholder="John"
                  styles={{marginTop: 16}}
                />

              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <TextField
                  value={userData.last_name}
                  onUserInput={(value: string) => handleFormInput(value, "last_name")}
                  theme={theme}
                  label="Last Name"
                  placeholder="Doe"
                  styles={{marginTop: 16}}
                />
              </View>
            </View>

            <View style={{ width: "100%", maxWidth: 500 }}>
              <TextField
                value={userData.email}
                placeholder="your_email@example.com"
                onUserInput={(value: string) => handleFormInput(value, "email")}
                theme={theme}
                label="Email"
                keyboard="email-address"
                styles={{marginTop: 16}}
              />
              <TextField
                value={userData.password}
                onUserInput={(value: string) => handleFormInput(value, "password")}
                label="Password"
                isPassword={true}
                placeholder="Really@,Complex_Password<3!"
                theme={theme}
                styles={{marginTop: 16}}
              />
              <TextField
                value={confirmPass}
                theme={theme}
                isPassword={true}
                onUserInput={(value: string) => {
                  setConfirmPass(value)
                }}
                placeholder="Really@,Complex_Password<3!_again"
                label="Confirm Password"
                styles={{marginTop: 16}}
              />
            </View>
          </View>

          <View style={{ width: "100%", marginTop: 40 }}>
            <TouchableOpacity
              onPress={async () => {
                //check for data validity
                if (!userData.password) { console.log("Password is required"); return; }
                else if (!isPasswordValid(userData.password)) { console.log("password is not valid"); return; }
                else if (userData.password != confirmPass) { console.log("Passwords dont match"); return; }

                if (!userData.email) { console.log("Email is required"); return; }
                else if (!isEmailValid(userData.email)) { console.log("email is not valid"); return; }

                if (!userData.first_name) { console.log("First Name is required"); return; }
                if (!userData.username) { console.log("Username is required"); return; }

                setLoading(true);

                let userDP = await uploadImagetoS3(userImage.uri == "" ? placeholder : userImage.uri, `${userData.username}_DP`, userImage.mimeType)

                if (userDP && !userDP.uploaded) { /**user img could not be saved in the s3 bucket */ }
                // else { setUserData({...userData, imgUrl: userDP?.userImgURL}) }
                let response = await postData(`${baseurl}/api/auth/register`, { ...userData, imgUrl: userDP?.userImgURL });
                // console.log(response);

                setLoading(false);
                if (response.success) {
                  saveToken(response.token, "reelzUserToken");
                  // dispatch(setUser(response.user))
                  router.replace('/(tabs)/home');
                } else {
                  console.log("The user was NOT saved")
                }

                //save the token here
              }}>
              <Text style={{ textAlign: 'center', paddingVertical: 10, fontSize: 18, color: "white", borderRadius: 9, backgroundColor: 'green' }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if(router.canGoBack()) {
                router.back();
              } else {
                router.push("/(auth)/login");
              }
            }}>
              <Text style={{ textAlign: 'center', color: '#2255ff', fontSize: 18, marginTop: 20 }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView >
  );
}