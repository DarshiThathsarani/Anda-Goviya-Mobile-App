import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import Button from "../ui/Button";
import Input from "./Input";
import FlatButton from "../ui/FlatButton";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import logo from "../../assets/Logo.png";

function AuthForm({
  isLogin,
  onSubmit,
  credentialsInvalid,
  selectedRole,
  onRoleChange,
}) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const [enteredName, setEnteredName] = useState("");
  const [enteredDistrict, setEnteredDistrict] = useState("");
  const navigation = useNavigation();

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
      case "phoneNumber":
        setEnteredPhoneNumber(enteredValue);
        break;
      case "name":
        setEnteredName(enteredValue);
        break;
      case "district":
        setEnteredDistrict(enteredValue);
        break;
    }
  }

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler() {
    onSubmit({
      name: enteredName,
      district: enteredDistrict,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      phoneNumber: enteredPhoneNumber,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <View>
        <View style={styles.topicContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          {/* <Text style={styles.subTopic}>{isLogin ? "Login" : "SignUp"}</Text> */}
        </View>

        <View style={styles.formContainer}>
          {!isLogin && (
            <Input
              label="Name"
              onUpdateValue={updateInputValueHandler.bind(this, "name")}
              value={enteredName}
              keyboardType="text"
            />
          )}
          {!isLogin && (
            <Input
              label="District"
              onUpdateValue={updateInputValueHandler.bind(this, "district")}
              value={enteredDistrict}
              keyboardType="text"
            />
          )}
          {!isLogin && (
            <Input
              label="Phone Number"
              onUpdateValue={updateInputValueHandler.bind(this, "phoneNumber")}
              keyboardType="number"
              value={enteredPhoneNumber}
            />
          )}
          <Input
            label="Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, "email")}
            value={enteredEmail}
            keyboardType="email-address"
            isInvalid={emailIsInvalid}
          />
          {!isLogin && (
            <Input
              label="Confirm Email Address"
              onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
              value={enteredConfirmEmail}
              keyboardType="email-address"
              isInvalid={emailsDontMatch}
            />
          )}
          <Input
            label="Password"
            onUpdateValue={updateInputValueHandler.bind(this, "password")}
            secure
            value={enteredPassword}
            isInvalid={passwordIsInvalid}
          />
          {!isLogin && (
            <Input
              label="Confirm Password"
              onUpdateValue={updateInputValueHandler.bind(
                this,
                "confirmPassword"
              )}
              secure
              value={enteredConfirmPassword}
              isInvalid={passwordsDontMatch}
            />
          )}
          {/* ** Role Picker** */}
          {!isLogin && (
            <View>
              <Text style={styles.label}>Role</Text>
              <Picker
                selectedValue={selectedRole}
                onValueChange={onRoleChange}
                style={styles.picker}
              >
                <Picker.Item label="Farmer" value="farmer" />
                <Picker.Item label="Landowner" value="landowner" />
              </Picker>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button onPress={submitHandler} style={styles.button}>
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </View>
        </View>
      </View>
      <FlatButton onPress={switchAuthModeHandler}>
        {isLogin ? "Create a new user" : "Log in instead"}
      </FlatButton>
    </ScrollView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  topicContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },

  logo: {
    width: 250,
    height: 250,
    padding: 0,
  },
  topic: {
    fontWeight: "bold",
    fontSize: 40,
    color: Colors.primary800,
  },
  subTopic: {
    fontSize: 20,
    color: Colors.primary800,
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonContainer: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    borderRadius: 25,
    height: 50,
  },
  label: {
    color: "grey",
    fontSize: 16,
    marginTop: 12,
  },
  picker: {},
});
