
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database, firestore, auth } from "../config/firebaseConfig";
import { ref, set, onValue } from "firebase/database";

import {
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  query,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const  Home = () => {
  const [voltage, setVoltage] = useState("");
  const [date, setDate] = useState("");
  const [current, setCurrent] = useState("");
  const [power, setPower] = useState("");
  const [energy, setEnergy] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  

  useEffect(() => {
    const dataRef = ref(database, "monitoring");

    // Fetch data
    const unsubscribe = onValue(dataRef, async (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setVoltage(fetchedData.voltage || "N/A");
        setCurrent(fetchedData.current || "N/A");
        setPower(fetchedData.power || "N/A");
        setEnergy(fetchedData.energy || "N/A")
        setDate(fetchedData.time || "N/A");
      }
      if (fetchedData) {
        const user = auth.currentUser;
        if (user) {
          //console.error("Users detected!");
          //Alert.alert("hello! user");
          const sendData = {
            voltage: fetchedData.voltage,
            current: fetchedData.current,
            power: fetchedData.power,
            date: fetchedData.date
          };

          try {
            const documentId = uuidv4();
            // Reference to a specific document in the monitoring collection
            const userMonitoringDocRef = doc(firestore, "users", user.uid, "monitoring", documentId);
            if(fetchedData.date === date.now)
              // Store the data in Firestore and update if the fetchedData.date will be match today's date
              await updateDoc(userMonitoringDocRef, sendData);
            else
              // Store the data in Firestore
              await setDoc(userMonitoringDocRef, sendData);
            console.log("Data saved successfully to Firestore!");
          } catch (error) {
            console.error("Error saving data to Firestore:", error);
          }
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [voltage, current, power, energy, date]); // Adding these dependencies ensures that the effect runs when any of them change

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const toggleSwitch = () => {
    setIsOn((prev) => {
      const newState = !prev;
  
      // Update the value in Firebase Realtime Database
      const stateRef = ref(database, "monitoring/state");
      set(stateRef, newState)
        .then(() => console.log("State updated successfully"))
        .catch((error) => console.error("Error updating state:", error));
  
      Animated.timing(slideAnim, {
        toValue: newState ? 30 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
  
      return newState;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Gas Level Info */}
        <View style={styles.gasLevelRow}>
          <Text style={styles.labelText}>Smart Classrom:</Text>
          <View style={styles.indicator}>
            <Ionicons name="information-circle" size={24} color="#4A4A4A" />
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeRow}>
          <Text style={styles.dateText}>Voltage: {voltage}V</Text>
          <Text style={styles.timeText}>Current: {current}A</Text>
          <Text style={styles.timeText}>Power: {power}W</Text>
          <Text style={styles.timeText}>Energy: {energy}kWh</Text>
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
  gasValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#4A4A4A",
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
  statusButton: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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

export default Home