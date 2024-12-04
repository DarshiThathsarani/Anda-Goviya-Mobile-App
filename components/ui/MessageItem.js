import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function MessageItem({ message, currentUser }) {
  const isMyMessage = currentUser === message.userId;

  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5, // Space between messages
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%", // Limit message width
  },
  myMessageContainer: {
    backgroundColor: "#d4edda", // Green-ish background for my messages
    alignSelf: "flex-end", // Align to the left
    marginRight: 10,
  },
  otherMessageContainer: {
    backgroundColor: "#709627", // Red-ish background for other messages
    alignSelf: "flex-start", // Align to the right
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
});
