import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const Home = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => {
          if (permission && permission.status === "granted") {
            setIsScanning(true);
          } else {
            requestPermission();
          }
        }}
      >
        <Ionicons name="scan" size={28} color="white" />
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      {isScanning && permission?.status === "granted" && (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsScanning(false)}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
  },
  scanButton: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  camera: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.6,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});

export default Home;
