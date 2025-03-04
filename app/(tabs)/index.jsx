import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database, firestore, auth } from "../config/firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import * as Location from "expo-location";

import {
  doc,
  setDoc,
  collection,
  onSnapshot
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const Home = () => {
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [street, setStreet] = useState("");  // 🟢 Added street state
  const [cntr, setCntr] = useState(0);
  const prevLocation = useRef("");
  const [loading, setLoading] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [count, setCount] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    const dataRef = ref(database, "monitoring");
  
    // Fetch data from Realtime Database
    const unsubscribe = onValue(dataRef, async (snapshot) => {
      const fetchedData = snapshot.val();
      if (!location && fetchedData) {
        setLongitude(fetchedData.longitude || "N/A");
        setLatitude(fetchedData.latitude || "N/A");
        setCity(fetchedData.city || "N/A");
        setStreet(fetchedData.street || "N/A");
        setCntr(fetchedData.cntr || -1);
        setLocation({
          longitude: fetchedData.longitude,
          latitude: fetchedData.latitude,
          accuracy: "N/A",
        });
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [permissionGranted]);
  

  useEffect(() => {
    let interval;
  
    const saveToFirestore = async () => {
      const user = auth.currentUser;
      if (user && longitude && latitude && street) {
        const sendData = {
          longitude: longitude,
          latitude: latitude,
          city: city,
          street: street,
          date: new Date().toLocaleString(),
        };
  
        try {
          if (prevLocation.current !== street) {
            const userMonitoringCollectionRef = collection(
              firestore, "users", user.uid, "monitoring"
            );
  
            const newDocRef = doc(userMonitoringCollectionRef, uuidv4());
            await setDoc(newDocRef, sendData);
            console.log("New location logged in Firestore!");
  
            prevLocation.current = street;
          }
        } catch (error) {
          console.error("Error saving data to Firestore:", error);
        }
      }
    };
  
    if (permissionGranted) {
      getLocation(); 
      interval = setInterval(() => {
        getLocation();
  
        if (longitude && latitude && street) {
          const monitoringRef = ref(database, "monitoring");
          set(ref(database, "monitoring/longitude"), longitude).catch((error) =>
            console.error("Error saving longitude:", error)
          );
          set(ref(database, "monitoring/latitude"), latitude).catch((error) =>
            console.error("Error saving latitude:", error)
          );
          set(ref(database, "monitoring/city"), city).catch((error) =>
            console.error("Error saving city:", error)
          );
          set(ref(database, "monitoring/street"), street).catch((error) =>
            console.error("Error saving street:", error)
          );
  
          saveToFirestore();
        }
      }, 10000);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [permissionGranted, longitude, latitude, city, street]);
  
  
  

  const checkPermissions = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      setPermissionGranted(true);
    } else {
      let { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(newStatus === "granted");
    }
  };

  const getLocation = async () => {
    if (!permissionGranted) {
      setErrorMsg("Location permission not granted.");
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLocation(currentLocation.coords);
      setCount((prevCount) => prevCount + 1);

      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address) {
        setStreet(address.street || "N/A");
        setCity(address.city || "N/A");
        setRegion(address.region || "N/A");
        setLatitude(currentLocation.coords.latitude || "N/A");
        setLongitude(currentLocation.coords.longitude || "N/A");
      }

    } catch (error) {
      setErrorMsg("Error getting location: " + error.message);
    }
  };

  const toggleSwitch = () => {
    const newState = !isOn;

    setIsOn(newState);

    const stateRef = ref(database, "monitoring/buzzer");
    set(stateRef, newState ? "ON" : "OFF")
      .then(() => console.log("State updated successfully"))
      .catch((error) => console.error("Error updating state:", error));

    Animated.timing(slideAnim, {
      toValue: newState ? 30 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.gasLevelRow}>
          <Text style={styles.labelText}>Smart Tracker</Text>
          <View style={styles.indicator}>
            <Ionicons name="information-circle" size={24} color="#4A4A4A" />
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          {!loading && location ? (
            <>
              <Text style={styles.dateText}>Longitude: {location.longitude}</Text>
              <Text style={styles.timeText}>Latitude: {location.latitude}</Text>
              <Text style={styles.timeText}>Accuracy: {location.accuracy} meters</Text>
              <Text style={styles.timeText}>Street: {street}</Text>
              <Text style={styles.timeText}>City: {city}</Text>
            </>
          ) : (
            <>
              <Text style={styles.dateText}>Longitude: {longitude}</Text>
              <Text style={styles.timeText}>Latitude: {latitude}</Text>
              <Text style={styles.timeText}>Street: {street}</Text>
              <Text style={styles.timeText}>Count: {cntr}</Text>
              <Text style={styles.timeText}>City: {city}</Text>
            </>
          )}
        </View>


        <View style={styles.switchContainer}>
          <Text style={styles.statusLabel}>{isOn ? "ON" : "OFF"}</Text>
          <TouchableOpacity style={styles.switch} onPress={toggleSwitch}>
            <Animated.View style={[styles.slider, { left: slideAnim }]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
  },
  cardContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignSelf: "center",
  },
  gasLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  labelText: {
    fontSize: 24,
    color: "#4A4A4A",
    fontWeight: "bold",
  },
  dateTimeRow: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switch: {
    width: 60,
    height: 30,
    backgroundColor: "#ddd",
    borderRadius: 30,
    padding: 3,
    justifyContent: "center",
  },
  slider: {
    width: 28,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 14,
    position: "absolute",
    top: 1,
  },
});

export default Home;
