import { View, FlatList, StyleSheet } from "react-native";
import React from "react";
import ChatItem from "./ChatItem";

export default function ChatList({ users, currentUser }) {
  //   console.log("chat list", users);
  return (
    <View>
      <FlatList
        style={styles.container}
        data={users}
        contentContainerStyle={{ paddingVertical: 25 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatItem item={item} currentUser={currentUser} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
  },
});
