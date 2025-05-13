import { Add, placeholder } from "@/contants/assets";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

export default function StoryView() {
  const profilePhoto = useSelector((state: any) => state.user.profile_picture);

  return (
    <View style={{ borderWidth: 2, borderColor: 'red'}}>
      {/* s3 to get the image */}
      {profilePhoto
        ? <Image src={profilePhoto} resizeMode="contain" borderRadius={35} style={{width: 70, height: 70}} />
        : <Image source={placeholder} resizeMode="contain" borderRadius={35} style={{width: 70, height: 70}} />
      }
      <Image source={Add} style={styles.addStoryBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  addStoryBtn: {
    position: "absolute",
    bottom: 0, right: 0,
    width: 25, height: 25,
    borderColor: "black",
    borderWidth: 4,
    borderRadius: 13,
    backgroundColor: "black" 
  }
});