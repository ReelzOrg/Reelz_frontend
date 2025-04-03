import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    console.log(key, value, "is saved successfully!")
  } catch (err) {console.log("error while saving data", err)}
}

export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if(value != null) {
      return JSON.parse(value);
    }
  } catch(err) {console.log("error while loading data", err)}
}


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
    console.error('Failed to retrieve JWT:', error);
    return null;
  }
}

export async function deleteToken(tokenName) { await SecureStore.deleteItemAsync(tokenName); }