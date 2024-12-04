import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import FarmerScreen from "./screens/FarmerScreen";
import LandOwnerScreen from "./screens/LandOwnerScreen";
import ChatScreen from "./screens/ChatScreen";
import WeatherScreen from "./screens/WeatherScreen";
import AccountScreen from "./screens/AccountScreen";
import { Colors } from "./constants/styles";
import ChatRoom from "./components/ui/ChatRoom";

import AuthContextProvider from "./store/auth-context";
import { AuthContext } from "./store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import ProfileDetails from "./screens/ProfileDetails";
import AdsScreen from "./screens/AdsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
        headerTitle: "Anda Goviya",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChatOverview"
      screenOptions={{
        headerTitle: "Anda Goviya",
      }}
    >
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
}

function AuthenticatedTabNavigator() {
  const authCtx = useContext(AuthContext);
  const role = authCtx.role;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = role === "farmer" ? "leaf" : "home";
          } else if (route.name === "ChatOverview") {
            iconName = "chatbox";
          } else if (route.name === "Add") {
            iconName = "add-circle";
          } else if (route.name === "Weather") {
            iconName = "cloudy";
          } else if (route.name === "Account") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary500,
        tabBarInactiveTintColor: "gray",
        headerTitle: "Anda Goviya",
      })}
    >
      {role === "farmer" && <Tab.Screen name="Home" component={FarmerScreen} />}
      {role === "landowner" && (
        <Tab.Screen name="Home" component={LandOwnerScreen} />
      )}
      <Tab.Screen
        name="ChatOverview"
        component={AuthenticatedStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="Account" component={AccountStackNavigator} />
    </Tab.Navigator>
  );
}

const AccountStack = createNativeStackNavigator();

function AccountStackNavigator() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerTitle: "Anda Goviya",
      }}
    >
      <AccountStack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="AdsScreen"
        component={AdsScreen}
        options={{ headerShown: false }}
      />
    </AccountStack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedTabNavigator />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const [error, setError] = useState(null);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedRole = await AsyncStorage.getItem("role");
        const storedUser = await AsyncStorage.getItem("userId");
        if (storedToken && storedRole && storedUser) {
          authCtx.authenticate(storedToken, storedRole, storedUser);
        }
      } catch (err) {
        console.error("Error fetching token:", err);
        setError("Failed to fetch authentication token.");
      } finally {
        setIsTryingLogin(false);
      }
    }

    fetchToken();
  }, [authCtx]);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />

      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
