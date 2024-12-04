import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { database } from "../util/firebase-config";
import { ref, onValue, remove } from "firebase/database";

function AdsScreen() {
  const route = useRoute();
  const { item } = route.params;
  const [ads, setAds] = useState([]);

  useEffect(() => {
    let adsRef;
    if (item.role === "farmer") {
      adsRef = ref(database, "farmerads"); // Reference to 'farmerads' in the database
    } else {
      adsRef = ref(database, "landads");
    }
    const unsubscribe = onValue(adsRef, (snapshot) => {
      const adsData = snapshot.val();
      if (adsData) {
        // Convert ads object to an array and filter by userId
        const filteredAds = Object.keys(adsData)
          .map((key) => ({
            id: key,
            ...adsData[key],
          }))
          .filter((ad) => ad.userId === item.userId); // Filter ads by userId

        setAds(filteredAds); // Update the ads in real-time
      } else {
        setAds([]); // If no ads, set to empty array
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [item.userId]);

  const handleDelete = (adId) => {
    Alert.alert("Delete Ad", "Are you sure you want to delete this ad?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const adRef = ref(
            database,
            `${item.role === "farmer" ? "farmerads" : "landads"}/${adId}`
          );
          remove(adRef)
            .then(() => {
              Alert.alert(
                "Ad Deleted",
                "The ad has been successfully deleted."
              );
            })
            .catch((error) => {
              console.error("Error deleting ad:", error);
              Alert.alert("Error", "An error occurred while deleting the ad.");
            });
        },
      },
    ]);
  };

  const renderAdTile = ({ item }) => (
    <View style={styles.adTile}>
      <Text style={styles.adTitle}>{item.title}</Text>
      <Text style={styles.adDescription}>{item.description}</Text>
      <Text style={styles.adDistrict}>District: {item.district}</Text>
      <Text style={styles.adDate}>
        Created at: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={ads}
        renderItem={renderAdTile}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display two tiles per row
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  adTile: {
    width: "48%", // Fixed width for the tile (with 2% margin on each side for spacing)
    margin: "1%", // Ensure consistent spacing between tiles
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative", // Ensure the delete button can be positioned relative to this container
    height: 200, // Set a fixed height for consistent layout
  },
  adTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  adDescription: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  adDistrict: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  adDate: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 30, // Extra space to avoid overlap with the delete button
  },
  deleteButton: {
    // backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    position: "absolute", // Absolutely position the button
    bottom: 10, // 10px from the bottom
    right: 10, // 10px from the right
  },
  buttonText: {
    color: "#f44336",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AdsScreen;
