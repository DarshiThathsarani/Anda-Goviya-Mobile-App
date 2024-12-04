import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import { database } from "../util/firebase-config";
import { ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

function AccountScreen() {
  const [userDetails, setUserDetails] = useState({});
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const userId = authCtx.userId;
  const role = authCtx.role;

  useEffect(() => {
    // Reference to the user data in Firebase
    const userDetailsRef = ref(database, "users/" + userId);

    // Fetch the user's details from Firebase
    onValue(userDetailsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserDetails(data);
      }
    });
  }, [userId]);

  function logoutHandler() {
    authCtx.logout();
  }

  function profileDetailsHandler() {
    // Navigate to the ProfileDetails screen (You can create this screen separately)
    navigation.navigate("ProfileDetails", { userDetails });
  }

  function myAdsHandler() {
    const item = { userId: userId, role: role };
    navigation.navigate("AdsScreen", { item });
  }

  function downloadPdfHandler() {
    // Open the PDF URL in the browser
    Linking.openURL("https://faolex.fao.org/docs/pdf/srl132398.pdf");
  }

  return (
    <View style={styles.screen}>
      {/* Top-left greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hello,</Text>
        <Text style={styles.userNameText}>{userDetails.name || "User"}!</Text>
      </View>

      {/* Middle links */}
      <View style={styles.middleView}>
        <TouchableOpacity onPress={profileDetailsHandler}>
          <Text style={styles.profileLink}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={myAdsHandler}>
          <Text style={styles.profileLink}>My Ads</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={downloadPdfHandler}>
          <Text style={styles.pdf}>Download Legal Aspect of AndhaGovi</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button with Icon */}
      <View style={styles.logoutView}>
        <Button title="Logout" onPress={logoutHandler} color="maroon" />
        <Ionicons name="log-out-outline" size={20} color="maroon" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Add padding for better spacing
  },
  greetingContainer: {
    flexDirection: "column",
    alignItems: "center", // Center align items in the greeting
    marginBottom: 40, // Space between greeting and middle links
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "300",
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "500",
  },
  profileLink: {
    fontSize: 18,
    color: "grey",
    marginTop: 20,
  },
  pdf: {
    fontSize: 18,
    color: "grey",
    marginTop: 20,
    fontWeight: "100",
  },
  middleView: {
    alignItems: "center", // Center align items in the middle view
    marginBottom: 40, // Space before logout button
  },
  logoutView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the logout button and icon
  },
});

export default AccountScreen;
