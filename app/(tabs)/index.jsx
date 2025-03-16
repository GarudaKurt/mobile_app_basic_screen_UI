
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
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

const  Home = () => {
  const [sensor1, setSensor1] = useState("");
  const [sensor2, setSensor2] = useState("");
  const [sensor3, setSensor3] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const dataRef = ref(database, "monitoring");

    // Fetch data
    const unsubscribe = onValue(dataRef, async (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setSensor1(fetchedData.s1 || "N/A");
        setSensor2(fetchedData.s2 || "N/A");
        setSensor3(fetchedData.s3 || "N/A");
        setDate(fetchedData.date || "N/A");
      }
      if (fetchedData) {
        const user = auth.currentUser;
        if (user) {
          //console.error("Users detected!");
          //Alert.alert("hello! user");
          const sendData = {
            sensor1: fetchedData.s1,
            sensor2: fetchedData.s2,
            sensor3: fetchedData.s3,
            date: fetchedData.date
          };

          try {
            const userMonitoringCollectionRef = collection(firestore, "users", user.uid, "monitoring");
  
            const q = query(userMonitoringCollectionRef, where("date", "==", fetchedData.date));
            const querySnapshot = await getDocs(q);
  
            if (!querySnapshot.empty) {
              // If a document exists for today, update it
              const existingDoc = querySnapshot.docs[0]; 
              await updateDoc(doc(firestore, "users", user.uid, "monitoring", existingDoc.id), sendData);
              console.log("Data updated successfully in Firestore!");
            } else {
              // If no document exists for today, create a new one
              const newDocRef = doc(userMonitoringCollectionRef, uuidv4());
              await setDoc(newDocRef, sendData);
              console.log("New data saved successfully to Firestore!");
            }
          } catch (error) {
            console.error("Error saving/updating data to Firestore:", error);
          }
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [sensor1, sensor2, sensor3, date]); // Adding these dependencies ensures that the effect runs when any of them change

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
          <Text style={styles.labelText}>IRRGATIONS</Text>
          <View style={styles.indicator}>
            <Ionicons name="information-circle" size={24} color="#4A4A4A" />
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeRow}>
          <Text style={styles.dateText}>Sensor 1: {sensor1}</Text>
          <Text style={styles.timeText}>Sensor 2: {sensor2}</Text>
          <Text style={styles.timeText}>Sensor 3: {sensor3}</Text>
          <Text style={styles.timeText}>Date: {date}</Text>
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