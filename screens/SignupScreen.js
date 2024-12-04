import React, { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";

import { createUser } from "../util/auth";
import { AuthContext } from "../store/auth-context";

import { database, auth } from "../util/firebase-config";
import { ref, set } from "firebase/database";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedRole, setSelectedRole] = useState("farmer");

  const authCtx = useContext(AuthContext);

  async function signUpHandler({
    email,
    password,
    phoneNumber,
    name,
    district,
  }) {
    try {
      setIsAuthenticating(true);
      const { user, accessToken } = await createUser(email, password);

      const userId = user.uid;

      const userData = {
        name: name,
        district: district,
        phoneNumber: phoneNumber,
        email: email,
        role: selectedRole,
      };

      set(ref(database, "users/" + userId), userData);

      authCtx.authenticate(accessToken, selectedRole, userId);
    } catch (err) {
      Alert.alert(
        "Authentication Failed!",
        "Could not sign ypu up. Please check your credentials!"
      );
      setIsAuthenticating(false);
      console.log(err);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={"Signing you up..."} />;
  }

  return (
    <AuthContent
      onAuthenticate={signUpHandler}
      onRoleChange={setSelectedRole}
      selectedRole={selectedRole}
    />
  );
}

export default SignupScreen;
