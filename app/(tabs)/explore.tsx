import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { SearchBar, SearchedAccTile, TextField } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { getData, postData } from "@/utils";
import { MinUserObject } from "@/utils/types";

export default function Explore() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchedUsers, setSearchedUsers] = useState<MinUserObject[]>();

  const _id = useSelector((state: any) => state.user._id);
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

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
              <TouchableOpacity onPress={async () => {
                const res = await postData(`${baseurl}/api/user/${_id}/process-media`, {toProcessUrls: [
                  "https://reelzapp.s3.us-east-1.amazonaws.com/userPosts/44938b73-afca-4cf9-a298-bd6c5a7bda46/97f5cd4d-e515-4775-b7b6-baf649f6c5c5/post_1000000046-0",
                  // "https://reelzapp.s3.us-east-1.amazonaws.com/userPosts/44938b73-afca-4cf9-a298-bd6c5a7bda46/97f5cd4d-e515-4775-b7b6-baf649f6c5c5/post_1000000041-1",
                  // "https://reelzapp.s3.us-east-1.amazonaws.com/userPosts/44938b73-afca-4cf9-a298-bd6c5a7bda46/97f5cd4d-e515-4775-b7b6-baf649f6c5c5/post_1000000044-2",
                  // "https://reelzapp.s3.us-east-1.amazonaws.com/userPosts/44938b73-afca-4cf9-a298-bd6c5a7bda46/97f5cd4d-e515-4775-b7b6-baf649f6c5c5/post_1000000045-3"
                ], uploadType: "post", post_id: "97f5cd4d-e515-4775-b7b6-baf649f6c5c5"}, token);
                // console.log(res);
                const data = await res?.json();
                console.log(data);
              }}>
                <Text style={{color: theme.text, padding: 5, borderRadius: 5, borderWidth: 2, borderColor: "red"}}>Test</Text>
              </TouchableOpacity>
            </View>
          )
        }
        </View>
      </View>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}