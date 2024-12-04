import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importing useNavigation for navigation
const userImage = require("../assets/Avatar.png"); // Adjust the path as needed

function ProfileDetails({ route }) {
  const { userDetails } = route.params;
  const navigation = useNavigation(); // Using navigation hook

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View>
          <Text style={styles.backButtonText}>← Back</Text>
        </View>
      </TouchableOpacity>

      <Image source={userImage} style={styles.profileImage} />
      <Text style={styles.title}>Profile Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userDetails.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userDetails.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userDetails.phoneNumber}</Text>

        <Text style={styles.label}>District:</Text>
        <Text style={styles.value}>{userDetails.district}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{userDetails.role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9", // Light background color
    alignItems: "center", // Center content horizontally
  },
  backButtonContainer: {
    backgroundColor: "transparent",
  },
  backButton: {
    alignSelf: "flex-start", // Align back button to the start
    marginBottom: 20,
    padding: 10,
    backgroundColor: "grey", // Button background color
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff", // White text for the button
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular profile image
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4a90e2", // Border color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark text color for title
    marginBottom: 20,
    textAlign: "center", // Center the title
  },
  detailsContainer: {
    width: "100%", // Full width for detail container
    backgroundColor: "#fff", // White background for details
    borderRadius: 10,
    padding: 15,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    textAlign: "center", // Centering the text in the details container
  },
  label: {
    fontSize: 16,
    fontWeight: "bold", // Semi-bold for labels
    color: "#555", // Darker grey for labels
    marginBottom: 5,
    textAlign: "center", // Centering labels
  },
  value: {
    fontSize: 18,
    color: "#333", // Darker text color for values
    marginBottom: 15, // Space between value texts
    textAlign: "center", // Centering values
  },
});

export default ProfileDetails;
