import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { database } from "../util/firebase-config";
import { ref, onValue, get } from "firebase/database"; // Change get to onValue
import ChatList from "../components/ui/ChatList";
import { AuthContext } from "../store/auth-context";

function ChatScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;

  useEffect(() => {
    if (userId) {
      const roomsRef = ref(database, "/rooms");

      // Subscribe to changes in rooms
      const unsubscribe = onValue(roomsRef, (snapshot) => {
        if (snapshot.exists()) {
          const roomsData = snapshot.val();

          const roomsArray = Object.keys(roomsData).map((key) => ({
            id: key,
            ...roomsData[key],
          }));

          // Filter rooms where userId is either user1 or user2
          const filteredRooms = roomsArray.filter((room) => {
            return (
              (room.user1 === userId || room.user2 === userId) && room.messages
            );
          });

          // Fetch details of the other users
          Promise.all(
            filteredRooms.map(async (room) => {
              const otherUserId =
                room.user1 === userId ? room.user2 : room.user1;
              const userRef = ref(database, `/users/${otherUserId}`);
              const userSnapshot = await get(userRef); // Fetch user details

              if (userSnapshot.exists()) {
                const userDetails = userSnapshot.val();
                userDetails.id = otherUserId;
                return userDetails; // Return userDetails instead of setting state here
              }
              return null; // Return null if user not found
            })
          ).then((usersWithDetails) => {
            // Filter out null values and update state
            setUsers(usersWithDetails.filter((user) => user));
            setLoading(false); // Set loading to false after data is set
          });
        } else {
          console.log("No chat rooms available");
          setLoading(false); // Set loading to false if no rooms
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : users.length > 0 ? (
        <ChatList currentUser={userId} users={users} />
      ) : (
        <Text style={styles.noChatsText}>No chats available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ChatScreen;
