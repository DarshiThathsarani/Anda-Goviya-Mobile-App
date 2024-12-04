import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  token: "",
  role: "",
  userId: "",
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [userRole, setUserRole] = useState();
  const [id, setUserId] = useState();

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedRole = await AsyncStorage.getItem("role");
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedToken && storedRole && storedUserId) {
        setAuthToken(storedToken);
        setUserRole(storedRole);
        setUserId(storedUserId);
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("role");
        AsyncStorage.removeItem("userId");
      }
    }

    fetchToken();
  }, []);
  function authenticate(token, role, userId) {
    setAuthToken(token);
    setUserRole(role);
    setUserId(userId);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("role", role);
    AsyncStorage.setItem("userId", userId);
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("role");
    AsyncStorage.removeItem("userId");
  }

  const value = {
    token: authToken,
    role: userRole,
    userId: id,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
