import { FontAwesome } from "@expo/vector-icons";
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";
import TextField from "./TextField";
import { useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function SearchBar({ searchTerm, setSearchTerm, isSearching, setIsSearching }:
  { searchTerm: string, setSearchTerm: (searchTerm: string) => void,
    isSearching: boolean, setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
   }) {
  const theme = useTheme();
  const searchRef = useRef<TextInput>(null);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 14 }}>
      {isSearching
        ? (
          <TouchableOpacity onPress={() => {
            setIsSearching(false);
            Keyboard.dismiss();
            searchRef.current?.blur();
          }}>
            <FontAwesome name="arrow-left" color={theme.text} size={20} />
          </TouchableOpacity>
        )
        : (null)
      }
      <View style={{ flex: 1, marginLeft: isSearching ? 10 : 0 }}>
        <TextField
          reference={searchRef}
          value={searchTerm}
          onPress={() => {
            setIsSearching(true)
          }}
          placeholder="Search"
          onUserInput={(value: string) => {
            setSearchTerm(value)
          }}
          theme={theme}
        />
      </View>
    </View>
  );
}