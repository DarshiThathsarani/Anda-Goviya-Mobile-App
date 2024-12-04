import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { formatDate, getRoomId } from "../../util/AndhaGoviUtility";
import { AuthContext } from "../../store/auth-context";
import { database } from "../../util/firebase-config";
import { ref, onValue, query, orderByChild } from "firebase/database";

export default function ChatItem({ item, currentUser }) {
  console.log("chat item", item);
  const [lastMessage, setLastMessage] = useState(null);
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;

  useEffect(() => {
    const roomId = getRoomId(currentUser, item.id); // Use item.otherUserId
    const messagesRef = ref(database, `rooms/${roomId}/messages`);

    const messagesQuery = query(messagesRef, orderByChild("createdAt"));

    const unSub = onValue(messagesQuery, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val());
      });
      messages.reverse(); // Show the latest messages on top
      setLastMessage(messages[0] || null); // Get the last message
    });

    return () => unSub(); // Cleanup subscription on unmount
  }, [currentUser, item.id]); // Include otherUserId in dependency array

  const openChatRoom = () => {
    navigation.navigate("ChatRoom", { item }); // Pass the item data to the ChatRoom screen
  };

  const renderTime = () => {
    if (lastMessage) {
      let date = lastMessage.createdAt;
      return formatDate(new Date(date));
    }
    return "";
  };

  const renderLastMessage = () => {
    if (!lastMessage) return "Loading...";
    return currentUser === lastMessage.userId
      ? `You: ${lastMessage.text}`
      : lastMessage.text;
  };

  return (
    <TouchableOpacity onPress={openChatRoom} style={styles.container}>
      <View style={styles.chatView}>
        {/* Ensure otherUserDetails is available */}
        <Text style={styles.userNameText}>
          {item.name ? item.name : "Unknown User"}
        </Text>
        <Text style={styles.timeText}>{renderTime()}</Text>
      </View>
      <Text>{renderLastMessage()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chatView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userNameText: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 16,
  },
  timeText: {
    flex: 1,
    textAlign: "right",
    color: "#888",
    fontSize: 12,
  },
});
