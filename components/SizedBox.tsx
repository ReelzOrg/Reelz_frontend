import { View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export default function SizedBox({width, height}: {width?: Float, height?: Float}) {
  return (
    <View style={{width: width, height: height}}></View>
  );
}