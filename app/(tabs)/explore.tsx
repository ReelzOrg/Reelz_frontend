import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { SearchBar, SearchedAccTile, TextField } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { getData } from "@/utils";
import { MinUserObject } from "@/utils/types";


export default function Explore() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchedUsers, setSearchedUsers] = useState<MinUserObject[]>();

  //TODO: create a separate search api for the frontend
  async function search(searchTerm: string) {
    try {
      const results = await getData(`${baseurl}/api/search?searchTerm=${searchTerm.trim()}`);
      const getSearchedUsers = await results?.json();
      setSearchedUsers(getSearchedUsers);
    } catch (err) {
      console.log("There was an error with the search API:", err)
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
      <View style={{backgroundColor: theme.background}}>
      {/* Search bar */}
      <SearchBar searchTerm={searchTerm}
        setSearchTerm={(value: string) => {
          setSearchTerm(value);
          value != ""
          ? search(value)
          : null;
        }}
        isSearching={isSearching} setIsSearching={setIsSearching}
      />

        {/* Explore content */}
        <View style={{}}> 
        {isSearching
          ? (
            <View style={{}}>
              {/* show a list of accounts that that matches the search term and according to the 6 degrees of seperation */}
              {/* <Text>Search for anyone</Text> */}
              {/* There will be a FlatList here that will show the accounts and call the SearchedAccTile component */}
              {/* <SearchedAccTile username="vivek20" first_name="Vivek" last_name="Doshi" /> */}
              <FlatList
                data={searchedUsers}
                renderItem={({ item, index }) => <SearchedAccTile
                  username={item.username}
                  first_name={item.first_name}
                  last_name={item.last_name}
                />}
              />
            </View>
          )
          : (
            <View style={{justifyContent: "center"}}>
              <Text style={{color: theme.text}}>Explore !</Text>
            </View>
          )
        }
        </View>
      </View>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}