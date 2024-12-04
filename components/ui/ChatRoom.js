import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import ChatRoomHeader from "./ChatRoomHeader";
import MessageList from "./MessageList";
import { TextInput } from "react-native-paper";
import { AuthContext } from "../../store/auth-context";
import { getRoomId } from "../../util/AndhaGoviUtility";
import { database } from "../../util/firebase-config";
import {
  ref,
  set,
  serverTimestamp,
  get,
  push,
  onValue,
  query,
  orderByChild,
} from "firebase/database";

export default function ChatRoom() {
  const route = useRoute();
  const { item } = route.params;
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef(null);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;

  useEffect(() => {
    const initializeRoom = async () => {
      await createRoomIfNotExist();
    };
    initializeRoom();

    const roomId = getRoomId(userId, item.id);
    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild("createdAt"));

    let unSub = onValue(messagesQuery, (snapshot) => {
      let allMessages = [];
      snapshot.forEach((childSnapshot) => {
        allMessages.push(childSnapshot.val());
      });
      setMessages(allMessages.reverse()); // Ensure the latest messages are at the bottom
    });

    return unSub;
  }, []);

  const createRoomIfNotExist = async () => {
    let roomId = getRoomId(userId, item.id);
    const roomRef = ref(database, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
      await set(roomRef, {
        user1: userId,
        user2: item.id,
        roomId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;

    try {
      let roomId = getRoomId(userId, item.id);
      const messagesRef = ref(database, `rooms/${roomId}/messages`);
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        userId,
        text: message,
        createdAt: serverTimestamp(),
      });

      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();
    } catch (err) {
      Alert.alert("Message", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 125}
    >
      <StatusBar barStyle="dark-content" />
      <ChatRoomHeader user={item} />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <MessageList messages={messages} currentUser={userId} />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Type Message..."
          onChangeText={(value) => (textRef.current = value)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between", // Ensures input is at the bottom
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#709627",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
