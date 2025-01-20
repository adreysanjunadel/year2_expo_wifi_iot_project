import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importing Material Icons
import { useRouter } from "expo-router"; // Import useRouter from expo-router
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth } = Dimensions.get("window");

const HomeDropdown = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility state
  const router = useRouter(); // Initialize router

  useEffect(() => {
    async function checkUser() {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) router.replace("/");
    }
    checkUser();
  }, []);

  // Sample dropdown items with action for navigation
  const dropdownItems = [
    { id: 1, label: "History", action: () => console.log("History selected") },
    { id: 2, label: "Settings", action: () => console.log("Settings Selected") }, // Directly add router.replace
    { 
      id: 3, 
      label: "Sign Out", 
      action: async () => {
        await AsyncStorage.removeItem("user"); // Ensure the promise is awaited
        router.replace("/"); // Properly access and call the replace method
      }
    }    
  ];

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <Pressable style={styles.dropdownButton} onPress={toggleDropdown}>
        <MaterialIcons
          name="more-vert" // Three-dot icon
          size={24}
          color="black"
        />
      </Pressable>

      {/* Dropdown List */}
      {isDropdownVisible && (
        <View style={styles.dropdownListContainer}>
          <FlatList
            data={dropdownItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  item.action(); // Call the action directly
                  setDropdownVisible(false); // Close dropdown after selection
                }}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </Pressable>
            )}
            style={styles.dropdownList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flexDirection: "row",
      justifyContent: "flex-end", // Aligns the dropdown to the end
      position: "relative", // Ensure dropdown appears correctly
    },
    dropdownButton: {
      backgroundColor: "transparent", // Remove background color
      padding: 10, // Optional padding for touch area
    },
    dropdownListContainer: {
      position: "absolute", // Position the dropdown relative to the button
      top: 40, // Adjust as needed to position the dropdown below the button
      right: 20, // Align the dropdown right under the button
      maxWidth: screenWidth * 0.6, // Set max width to 60% of screen width
      backgroundColor: "#fff",
      borderRadius: 8,
      elevation: 3, // Shadow for Android
      shadowColor: "#000", // Shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 1000, // Keep dropdown above other elements
    },
    dropdownList: {
      backgroundColor: "#fff",
      borderRadius: 8,
      zIndex: 1000, // Higher zIndex for the dropdown list
    },
    dropdownItem: {
      paddingVertical: 12, // Increased padding
      paddingHorizontal: 15, // Increased padding
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      zIndex: 1000, // Higher zIndex for each item
    },
    itemText: {
      fontSize: 18, // Increased font size
    },
});

export default HomeDropdown;
