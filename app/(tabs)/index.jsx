
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database, firestore, auth } from "../config/firebaseConfig";
import { ref, onValue } from "firebase/database";

import {
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  query,
  addDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const  Home = () => {
  const [gasValue, setGasValue] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [warnData, setWarnData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(database, "data");

    // Fetch data
    const unsubscribe = onValue(dataRef, async (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setGasValue(fetchedData.gasValue || 0);
        setDate(fetchedData.date || "N/A");
        setTime(fetchedData.time || "N/A");
      }
      if (fetchedData && fetchedData.gasValue > 200) {
        // Only store data if gas value is over 200
        const user = auth.currentUser;
        if (user) {
          //console.error("Users detected!");
          //Alert.alert("hello! user");
          const sendData = {
            gasValues: fetchedData.gasValue,
            date: fetchedData.date,
            time: fetchedData.time,
          };

          try {
            const documentId = uuidv4();
            // Reference to a specific document in the monitoring collection
            const userMonitoringDocRef = doc(firestore, "users", user.uid, "monitoring", documentId);

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
  }, [gasValue, date, time]); // Adding these dependencies ensures that the effect runs when any of them change

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Gas Level Info */}
        <View style={styles.gasLevelRow}>
          <Text style={styles.labelText}>GAS LEVEL:</Text>
          <Text style={styles.gasValue}>{gasValue}</Text>
          <View style={styles.indicator}>
            <Ionicons name="information-circle" size={24} color="#4A4A4A" />
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeRow}>
          <Text style={styles.dateText}>Date: {date}</Text>
          <Text style={styles.timeText}>Time: {time}</Text>
        </View>

        {/* Status Button */}
        <TouchableOpacity
          style={[
            styles.statusButton,
            { backgroundColor: gasValue > 100 ? "#f39c12" : "#28a745" },
          ]}
        >
          <Text style={styles.statusText}>
            {gasValue > 100 ? "WARNING" : "NORMAL"}
          </Text>
        </TouchableOpacity>
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
    fontSize: 16,
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
});

export default Home