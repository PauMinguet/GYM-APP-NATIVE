import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../logger";
import { RootStackScreenProps } from "../types";
import {  } from "tamagui";

export default function SafeMyFeed(
  props: RootStackScreenProps<"MyFeed">
) {
  return (
    <>
      <SignedIn>
        <MyFeedScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text>Unauthorized</Text>
        </View>
      </SignedOut>
    </>
  );
}

function MyFeedScreen({ navigation }: RootStackScreenProps<"MyFeed">) {
  const { getToken, signOut } = useAuth();
  const { user } = useUser();

  const [sessionToken, setSessionToken] = React.useState("");
  const [workouts, setWorkouts] = React.useState([]);

  const getLikedSplits = async (userId: number) => {
    try {
      const response = await fetch(
        `https://gym-app-yc3r.onrender.com/workouts/split/${userId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return [];
    }
  };

  React.useEffect(() => {
    const userId = 1; // Replace with the actual user ID or parameter needed for the API request

    // Call the fetchWorkouts function when the component mounts
    getLikedSplits(userId)
      .then((data) => {
        console.log(data); // Log the fetched data
        setWorkouts(data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  React.useEffect(() => {
    const scheduler = setInterval(async () => {
      const token = await getToken();
      setSessionToken(token as string);
    }, 1000);
    return () => clearInterval(scheduler);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Recommendations for you, {user?.firstName}</Text>
        <Text>Recommended workouts: </Text>
        <Text>{JSON.stringify(workouts, null, 2)}</Text>
        <Text style={styles.token}>{sessionToken}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  token: {
    marginTop: 15,
    paddingVertical: 15,
    fontSize: 15,
  },
});
