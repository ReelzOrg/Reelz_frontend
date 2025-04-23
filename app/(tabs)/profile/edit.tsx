import PressableProfilePhoto from "@/components/PressableProfilePhoto";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {


  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {/* cancel and done buttons */}

          {/* Update the UserObject in userDataSlice to include the images properties */}
          {/* or create a new slice */}
          {/* <PressableProfilePhoto userProfilePhoto={{}} imageSize={75} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}