import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { SearchBar, SearchedAccTile, TextField } from "@/components";
import { useTheme } from "@/context/themeContext";

export default function Explore() {
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
      <View style={{backgroundColor: theme.background}}>
      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}
      isSearching={isSearching} setIsSearching={setIsSearching} />

      <ScrollView>
        {/* Explore content */}
        <View style={{}}> 
        {isSearching
          ? (
            <View style={{}}>
              {/* show a list of accounts that that matches the search term and according to the 6 degrees of seperation */}
              {/* <Text>Search for anyone</Text> */}
              {/* There will be a FlatList here that will show the accounts and call the SearchedAccTile component */}
              <SearchedAccTile username="vivek20" first_name="Vivek" last_name="Doshi" />
            </View>
          )
          : (
            <View style={{justifyContent: "center"}}>
              <Text style={{color: theme.text}}>Explore !</Text>
            </View>
          )
        }
        </View>
      </ScrollView>
      </View>
      <StatusBar style={themeMode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}