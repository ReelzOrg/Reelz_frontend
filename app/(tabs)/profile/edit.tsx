import PressableProfilePhoto from "@/components/PressableProfilePhoto";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { TextField } from "@/components";
import { postData } from "@/utils";
import { setUser } from "@/state/slices";

export default function EditProfile() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.jwtToken.token);
  
  const [userData, setUserData] = useState(useSelector((state: any) => state.user));
  const theme = useTheme();

  useEffect(() => {
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {/* cancel and done buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: theme.text }}>Cancel</Text>
            <Text style={{ color: theme.text }}>Done</Text>
          </View>

          {/* profile info */}
          <View>
            {/* profile photo */}
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <PressableProfilePhoto userProfilePhoto={{
                uri: userData.profile_picture,
                mimeType: "image",
              }} imageSize={75} userProfilePhotoUpdater={setUserData} />
            </View>

            {/* username */}
            <View style={{ marginTop: 20 }}>
              <TextField
                value={userData.username}
                onUserInput={(value: string) => setUserData({ ...userData, username: value })}
                theme={theme}
                placeholder="Your username"
                isUsername={true}
              />
            </View>

            {/* first and last name */}
            <View style={{ width: "100%", maxWidth: 500 }}>
              <TextField
                value={userData.first_name}
                onUserInput={(value: string) => setUserData({ ...userData, first_name: value })}
                theme={theme}
                label="First Name"
                placeholder="John"
                styles={{ marginTop: 16 }}
              />
              <TextField
                value={userData.last_name}
                onUserInput={(value: string) => setUserData({ ...userData, last_name: value })}
                theme={theme}
                label="Last Name"
                placeholder="Doe"
                styles={{ marginTop: 16 }}
              />
            </View>

            {/* email */}
            <View style={{ marginTop: 20 }}>
              <TextField
                value={userData.email}
                onUserInput={(value: string) => setUserData({ ...userData, email: value })}
                theme={theme}
                label="Email"
                placeholder="your_email@example.com"
                keyboard="email-address"
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <TextField
                value={userData.bio}
                onUserInput={(value: string) => setUserData({ ...userData, bio: value })}
                theme={theme}
                label="Bio"
                placeholder="Tell us about yourself"
                styles={{ marginTop: 20 }}
              />
            </View>

            <View>
              {userData.websites.map((website: string, index: number) => (
                <View key={index} style={{ marginTop: 16 }}>
                  <TextField
                    value={website}
                    onUserInput={(value: string) => setUserData({ ...userData, websites: [...userData.websites.slice(0, index), value, ...userData.websites.slice(index + 1)] })}
                    theme={theme}
                    label={`Website ${index + 1}`}
                    placeholder="https://virajdoshi.xyz"
                  />
                </View>
              ))}
            </View>

            <View>
              <TextField
                value={userData.dob}
                onUserInput={(value: string) => setUserData({ ...userData, dob: value })}
                theme={theme}
                label="Date of Birth"
                placeholder="MM/DD/YYYY"
              />
            </View>

            <View>
              <TextField
                value={userData.phone}
                onUserInput={(value: string) => setUserData({ ...userData, phone: value })}
                theme={theme}
                label="Phone"
                placeholder="123-456-7890"
              />
            </View>

            <View>
              <TextField
                value={userData.gender}
                onUserInput={(value: string) => setUserData({ ...userData, gender: value })}
                theme={theme}
                label="Gender"
                placeholder="Male"
              />
            </View>
          </View>

          {/* save button */}
          <TouchableOpacity style={{ marginTop: 20 }} onPress={async () => {
            console.log("we have updated the user profile", userData);
            //make an api request to save the user info and then save it in the redux store
            const updatedUser = {
              username: userData.username,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              bio: userData.bio,
              websites: userData.websites,
              dob: userData.dob,
              phone: userData.phone,
              gender: userData.gender,
            }
            
            const updatUser = await postData(`${baseurl}/api/user/${userData._id}/edit-profile`, updatedUser, token);
            const data = await updatUser?.json();
            console.log("Did we update the user?", data);
            dispatch(setUser(data));
          }}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}