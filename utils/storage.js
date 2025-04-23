import * as SecureStore from 'expo-secure-store';

// export const loadData = async (key) => {
//   try {
//     const value = await AsyncStorage.getItem(key);
//     if(value != null) {
//       return JSON.parse(value);
//     }
//   } catch(err) {console.log("error while loading data", err)}
// }

// JWT token / Data
export async function saveToken(token, tokenName) {
  try {
    await SecureStore.setItemAsync(tokenName, token);
    console.log('Data saved successfully');
  } catch(err) {
    console.log(err);
  }
}

export async function getToken(tokenName) {
  try {
    const jwtToken = await SecureStore.getItemAsync(tokenName);
    return jwtToken;
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return null;
  }
}

export async function deleteToken(tokenName) { await SecureStore.deleteItemAsync(tokenName); }