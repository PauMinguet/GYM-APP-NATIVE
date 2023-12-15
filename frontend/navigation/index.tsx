/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from @expo/vector-icons

import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { ClerkLoaded, useAuth, useUser } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MyFeed from "../screens/MyFeed";
import { TouchableOpacity } from "react-native";
import { log } from "../logger";

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

/**
 * Read more about the protected routes pattern in React Native
 *
 * https://reactnavigation.org/docs/auth-flow
 */

const RootNavigator = () => {
  const { isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  const reloadFeed = async () => {
    
  };

  return (
    <ClerkLoaded>
      {isSignedIn ? (
        <Tab.Navigator
          initialRouteName="Profile"
          screenOptions={{
            tabBarActiveTintColor: "black",
          }}
        >
          <Tab.Screen
            name="Feed"
            component={MyFeed}
            options={{
              tabBarLabel: "Feed",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
              headerRight: () => (
                <TouchableOpacity onPress={reloadFeed}>
                  <MaterialCommunityIcons
                    name="refresh"
                    color="black"
                    size={30}
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={MyProfileScreen}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={size}
                />
              ),
              headerRight: () => (
                <TouchableOpacity onPress={onSignOutPress}>
                  <MaterialCommunityIcons
                    name="exit-to-app"
                    color="black"
                    size={30}
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Sign Up" }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Sign In" }}
          />
          <Stack.Screen
            name="VerifyCode"
            component={VerifyCodeScreen}
            options={{ title: "Sign Up" }}
          />
        </Stack.Navigator>
      )}
    </ClerkLoaded>
  );
};
