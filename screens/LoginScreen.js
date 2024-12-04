import React, { useContext, useState, useEffect } from "react";

import Authcontent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";

import { login } from "../util/auth";
import { Alert } from "react-native";

import { AuthContext } from "../store/auth-context";
import { database, auth } from "../util/firebase-config";
import { onValue, ref, set } from "firebase/database";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    try {
      setIsAuthenticating(true);
      const { user, accessToken } = await login(email, password);

      const userId = user.uid;

      const userDetails = ref(database, "users/" + userId);
      onValue(userDetails, (snapshot) => {
        const data = snapshot.val();
        const role = data.role;
        authCtx.authenticate(accessToken, role, userId);
      });
    } catch (err) {
      Alert.alert(
        "Authentication Failed!",
        "Could not log you in. Please check your credentials!"
      );
      setIsAuthenticating(false);
      console.log(err);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={"Logging you in..."} />;
  }

  return <Authcontent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
