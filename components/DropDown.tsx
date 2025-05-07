import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const InlineDropdown = ({ optionsList, onSelect, initialValue }: {optionsList: string[], onSelect: (item: any) => void, initialValue?: string}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleSelect = (item: any) => {
    setSelectedValue(item);
    onSelect(item);
    setDropdownVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.buttonText}>{selectedValue || initialValue}</Text>
          <FontAwesome name="chevron-down" size={16} style={{marginLeft: 5, color: "white"}} />
        </View>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={optionsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: { margin: 20 },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    position: 'relative',
    minWidth: 120
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: '600', fontSize: 16 },
  
  //TODO: make this better
  dropdown: {
    position: "absolute",
    zIndex: 2,
    top: 35, left: 2,
    minWidth: 200,
    marginTop: 5, backgroundColor: "black", borderRadius: 8,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.1,
    shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  option: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  optionText: { fontSize: 16, color: "white" },
});

export default InlineDropdown;
