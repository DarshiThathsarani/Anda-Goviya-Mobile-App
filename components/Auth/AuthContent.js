import { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import { SafeAreaProvider } from "react-native-safe-area-context";

function AuthContent({ isLogin, onAuthenticate, selectedRole, onRoleChange }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  // function switchAuthModeHandler() {
  //   if (isLogin) {
  //     navigation.replace("Signup");
  //   } else {
  //     navigation.replace("Login");
  //   }
  // }

  function submitHandler(credentials) {
    let {
      email,
      confirmEmail,
      password,
      confirmPassword,
      name,
      district,
      phoneNumber,
    } = credentials;

    email = email.trim();
    password = password.trim();
    name = name.trim();
    district = district.trim();
    phoneNumber = phoneNumber.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password, name, district, phoneNumber });
  }

  return (
    <SafeAreaProvider>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
          selectedRole={selectedRole}
          onRoleChange={onRoleChange}
        />
        {/* <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton> */}
      </View>
    </SafeAreaProvider>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    paddingBottom: 50,

    // margin: 20,
    // padding: 20,
    // backgroundColor: Colors.primary800,
    // elevation: 2,
    // height: "90%",
    // display: "flex",
    // justifyContent: "center",
    // borderRadius: 8,
    // shadowColor: "black",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4,
  },
});
