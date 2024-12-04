import { View, Text } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ChatRoomHeader({ user }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: user.name, // Set an empty title or customize
    });
  }, [navigation]);

  return;
}
