import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable
} from "react-native";
import { Avatar, Button, Icon, Card } from "@rneui/themed";
import { Link, router, useRouter } from "expo-router";
import { useAuthStore } from "../zustand/zustand";


const CustomListItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={style.listItem} onPress={onPress}>
    <Icon name={icon} type="material" style={style.iconContainer} />
    <Text style={style.listItemTitle}>{title}</Text>
  </TouchableOpacity>
);


const Profile = () => {
  const [userName, setUserName] = useState("John Doe");
  const [newbalance, setnewBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter()
  const logOut = useAuthStore((state) => state.logOut);
  const balance = useAuthStore((state) => state.balance);
  const setBalances = useAuthStore((state) => state.setBalances);

  
  const handleLogout = async () => {
    const success = await logOut();
    console.log("Logout success:", success);
    if (success) {
      router.push("/register"); // Navigate to the root `index.jsx`
    } else {
      console.log("Logout failed");
    }
  };

  
  const handleCashIn = () => {
    console.log("New Balance: ", newbalance);
    setBalances(balance + newbalance); // Add the new amount to the current balance
    setModalVisible(false);
    setnewBalance(0); // Reset input after submission
  };
  
  

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Card containerStyle={style.profileCard}>
        <View style={style.profileContainer}>
          <Avatar
            size={100}
            rounded
            source={{ uri: "https://via.placeholder.com/100" }} // Placeholder image URL
            containerStyle={style.avatar}
          />
          <Text style={style.profileName}>{userName}</Text>
          <Text style={style.profileUsername}>{"No Email"}</Text>
        </View>
      </Card>

      <View style={style.infoContainer}>
        <Link href="/userDetails" asChild>
        <CustomListItem icon="settings" title="Settings" />
        </Link>
        <CustomListItem
          icon="credit-card"
          title="Cash In"
          onPress={() => setModalVisible(true)}
        />
        <Link href="/friendList" asChild>
          <CustomListItem icon="bar-chart" title="Reports" />
        </Link>
      </View>

      <Button
        title="Logout"
        buttonStyle={style.logoutButton}
        onPress={handleLogout}
      />
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={style.modalOverlay}>
          <View style={style.modalView}>
            <Text style={style.modalTitle}>Add New Balance</Text>
            <TextInput
              style={style.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={String(newbalance)} // Ensure it's a string for the input
              onChangeText={(text) => setnewBalance(Number(text))} // Properly update the state
            />

            <Pressable style={style.modalButton} onPress={handleCashIn}>
              <Text style={style.buttonTextSubmit}>Submit</Text>
            </Pressable>
            <Pressable
              style={[style.modalButton, style.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={style.buttonTextCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 5,
  },
  profileCard: {
    marginBottom: 16,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 0,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileUsername: {
    fontSize: 16,
    color: "gray",
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconContainer: {
    marginRight: 16,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
  },
  logoutButton: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#FF3B30",
    borderRadius: 3,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  modalButton: {
    backgroundColor: "#00BEE5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F3F3",
  },
  buttonTextSubmit: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonTextCancel: {
    color: "#2C2C2C",
    fontWeight: "bold",
  },
});

export default Profile;
