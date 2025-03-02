import { GoogleSignin } from "@react-native-google-signin/google-signin";

const checkIfUserIsValid = async () => {
  const isValid = await GoogleSignin;
  if (isValid) {
    // navigate to your main screens
  } else {
    try {
      await GoogleSignin.signInSilently();
    } catch (err: any) { console.log("Error", err.code);}
  }
};