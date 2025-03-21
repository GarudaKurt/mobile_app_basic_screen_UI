import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { database } from "../config/firebaseConfig";
import { ref, onValue, set, push } from "firebase/database";

const Home = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [payment, setPayment] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (permission && permission.status === "denied") {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in settings.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Retry", onPress: requestPermission },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  }, [permission]);

  // Fetch balance and history from Firebase
  useEffect(() => {
    const dataRef = ref(database, "data");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setCurrentBalance(fetchedData.balance || 0);
        const fetchedHistory = fetchedData.history ? Object.values(fetchedData.history).reverse() : [];
        setHistory(fetchedHistory);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle QR scan
  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return; // Prevent double scan trigger
    setScanned(true);
  
    const parsedPayment = parseFloat(data);
    if (isNaN(parsedPayment) || parsedPayment <= 0) {
      Alert.alert("Invalid Payment", "QR code data is not a valid payment amount.");
    } else {
      setPayment(parsedPayment);
      Alert.alert("QR Code Scanned", `Payment: ₱${parsedPayment}`);
    }
  
    // Reset scan state after a short delay
    setTimeout(() => setScanned(false), 1500);
  };
  

  // Deduct payment and update Firebase
  useEffect(() => {
    if (payment > 0 && currentBalance >= payment) {
      const newBalance = currentBalance - payment;
      setCurrentBalance(newBalance);
      set(ref(database, "data/balance"), newBalance);
      
      const historyRef = ref(database, "data/history");
      const newTransaction = { type: "Bank Transfer", amount: -payment, date: new Date().toISOString() };
      push(historyRef, newTransaction);

      setHistory((prevHistory) => [newTransaction, ...prevHistory]);

      Alert.alert("Payment Successful", `₱${payment} deducted from your balance.`);
      setPayment(0);
    } else if (payment > 0 && currentBalance < payment) {
      Alert.alert("Insufficient Funds", "Your balance is too low for this payment.");
      setPayment(0);
    }
  }, [payment]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Balance</Text>
        <Text style={styles.amountText}>₱{currentBalance}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal" size={24} color="#007bff" />
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (permission && permission.status === "granted") {
                setIsScanning(true);
              } else {
                requestPermission();
              }
            }}
          >
            <Ionicons name="scan" size={24} color="#007bff" />
            <Text style={styles.actionText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {history.length > 0 ? (
        history.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <Text style={styles.activityText}>{activity.type}</Text>
            <Text style={activity.amount > 0 ? styles.activityAmountPositive : styles.activityAmountNegative}>
              {activity.amount > 0 ? "+" : "-"}₱{Math.abs(activity.amount)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noActivityText}>No recent activity</Text>
      )}

      {isScanning && permission?.status === "granted" && (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.centeredCamera}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsScanning(false)}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3" },
  balanceCard: { backgroundColor: "#4bbef5", padding: 20, alignItems: "center", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  balanceText: { color: "#fff", fontSize: 18 },
  amountText: { color: "#fff", fontSize: 32, fontWeight: "bold", marginVertical: 10 },
  actionButtons: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 },
  actionText: { color: "#007bff", fontWeight: "bold", marginLeft: 5 },
  sectionTitle: { marginLeft: 20, fontSize: 18, fontWeight: "bold", marginTop: 10 },
  activityCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginHorizontal: 20, marginTop: 5, flexDirection: "row", justifyContent: "space-between" },
  activityText: { color: "#555" },
  activityAmountPositive: { color: "#4CAF50", fontWeight: "bold" },
  activityAmountNegative: { color: "#F44336", fontWeight: "bold" },
  cameraContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  centeredCamera: { width: 300, height: 300, justifyContent: "center", alignItems: "center" },
  actionButtons: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 },
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 10, width: "45%", justifyContent: "center" },
  actionText: { color: "#007bff", fontWeight: "bold", marginLeft: 5 },
  sectionTitle: { marginLeft: 20, fontSize: 18, fontWeight: "bold", marginTop: 10 },
});

export default Home;
