// AdCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AdCard = ({ ad, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(ad)}>
      <Text style={styles.cardTitle}>{ad.title}</Text>
      <Text>{ad.district}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdCard;
