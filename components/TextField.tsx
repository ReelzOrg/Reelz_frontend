import { KeyboardTypeOptions, StyleProp, Text, TextInput, useWindowDimensions, View, ViewStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomTheme } from "@/utils/types";

export default function TextField(
  {value, onUserInput, theme, placeholder, label, isUsername = false, isPassword = false, keyboard = "default", onPress=()=>{}, reference=null, styles=null }:
  {value: string, onUserInput: (text: string) => void, theme: CustomTheme, placeholder: string, label?: string, isUsername?: boolean, isPassword?: boolean, keyboard?: KeyboardTypeOptions, onPress?: () => void, reference?: any, styles?: StyleProp<ViewStyle>}) {
  const { width, height } = useWindowDimensions();
  const halfWidth = width/2;

  return (
    <View style={styles}>
      {label
        ? <Text style={{color: theme.text, fontSize: 18}}>{label}</Text>
        : null
      }
      <TextInput
        ref={reference}
        value={value}
        passwordRules="required: upper; required: lower; required: digit; minlength: 8"
        secureTextEntry={isPassword}
        onChangeText={onUserInput}
        // onFocus={onFocus}
        onPress={onPress}
        textAlign={isUsername ? 'center' : 'left'}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        keyboardType={keyboard}
        style={{
          fontSize: 18,
          paddingVertical: 7, paddingHorizontal: 10,
          // marginTop: isUsername ? 0 : 8,
          color: theme.text,
          // textAlign: 'center',
          width: isUsername ? RFValue(halfWidth+30) : "100%",
          maxWidth: isUsername ? 300 : null, height: 40,
          borderRadius: 9,
          backgroundColor: theme.textField
        }}
      />
    </View>
  );
}