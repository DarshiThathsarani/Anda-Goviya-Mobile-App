import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../store/auth-context";

function WelcomeScreen() {
  const [fetchedMessage, setFetchedMessage] = useState("");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const role = authCtx.role;

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(
          "https://andhagovi-9b109-default-rtdb.firebaseio.com/message.json?auth=" +
            token
        );
        setFetchedMessage(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessage();
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
