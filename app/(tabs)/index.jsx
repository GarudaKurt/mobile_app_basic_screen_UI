import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView
} from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useAuthStore } from "../zustand/zustand";

const Home = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const balance = useAuthStore((state) => state.balance);
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

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert("QR Code Scanned", `Data: ${data}`, [
      { text: "OK", onPress: () => setScanned(false) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Balance</Text>
        <Text style={styles.amountText}>₱{balance}</Text>
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

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Monthly Expenses</Text>
          <Text style={styles.infoAmount}>₱2891.12</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Weekly Spending</Text>
          <Text style={styles.infoAmount}>₱276.95</Text>
        </View>
    
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>Money Received</Text>
        <Text style={styles.activityAmountPositive}>+526.00</Text>
      </View>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>Bank Transfer</Text>
        <Text style={styles.activityAmountNegative}>-19.33</Text>
      </View>

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
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 10, width: "45%", justifyContent: "center" },
  actionText: { color: "#007bff", fontWeight: "bold", marginLeft: 5 },
  infoRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  infoCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, width: "45%", alignItems: "center" },
  infoCardFull: { backgroundColor: "#fff", padding: 15, borderRadius: 10, width: "92%", alignItems: "center", marginTop: 10 },
  infoTitle: { color: "#888" },
  infoAmount: { fontWeight: "bold", fontSize: 18 },
  sectionTitle: { marginLeft: 20, fontSize: 18, fontWeight: "bold", marginTop: 10 },
  activityCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginHorizontal: 20, marginTop: 5, flexDirection: "row", justifyContent: "space-between" },
  activityText: { color: "#555" },
  activityAmountPositive: { color: "#4CAF50", fontWeight: "bold" },
  activityAmountNegative: { color: "#F44336", fontWeight: "bold" },
  cameraContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  centeredCamera: { width: 300, height: 300, justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: 40, right: 20 }
});

export default Home;
