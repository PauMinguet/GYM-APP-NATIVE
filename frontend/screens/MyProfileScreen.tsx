import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar } from "react-native";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../logger";
import { RootStackScreenProps } from "../types";
import {  } from "tamagui";
import Dropdown from "../components/Dropdown";

export default function SafeMyProfileScreen(
  props: RootStackScreenProps<"MyProfile">
) {
  return (
    <>
      <SignedIn>
        <MyProfileScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text>Unauthorized</Text>
        </View>
      </SignedOut>
    </>
  );
}

function MyProfileScreen({ navigation }: RootStackScreenProps<"MyProfile">) {
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

  

  React.useEffect(() => {
    const scheduler = setInterval(async () => {
      const token = await getToken();
      setSessionToken(token as string);
    }, 1000);
    return () => clearInterval(scheduler);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Hello {user?.firstName}</Text>

      <View style={styles.container}>
      <Dropdown label={'Select Item'} />
      <Text>This is the rest of the form.</Text>
      <StatusBar style="auto" />
    </View>
      <Text style={styles.sectionTitle}>Fetched data:</Text>
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdown}>
          {/* Display fetched data as a string */}
          <Text style={styles.dropdownText}>{JSON.stringify(workouts, null, 2)}</Text>
        </View>
      </View>
      <Text style={styles.token}>{sessionToken}</Text>
    </View>
  </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e78b7',
    height: 50,
    width: '90%',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  dropdownContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownText: {
    fontSize: 14,
  },
  token: {
    marginTop: 20,
    fontSize: 16,
    color: '#555555',
  },
});
