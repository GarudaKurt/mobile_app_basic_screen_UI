import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Icon, Card } from "@rneui/themed";
import { Link, router, useRouter } from "expo-router";
import { useAuthStore } from "../zustand/zustand";

const CustomListItem = ({ icon, title }) => (
  <TouchableOpacity style={style.listItem}>
    <Icon name={icon} type="material" style={style.iconContainer} />
    <Text style={style.listItemTitle}>{title}</Text>
  </TouchableOpacity>
);

const Profile = () => {
  const router = useRouter()
  const logOut = useAuthStore((state) => state.logOut);
  const getEmail = useAuthStore((state) => state.getUserEmail)
  const getName = useAuthStore((state) => state.getUserName)

  const [userName, setUserName] = useState(getEmail);
  
  
  const handleLogout = async () => {
    const success = await logOut();
    console.log("Logout success:", success);
    if (success) {
      router.push("/register");
    } else {
      console.log("Logout failed");
    }
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
          <Text style={style.profileUsername}></Text>
        </View>
      </Card>

      <View style={style.infoContainer}>
        <Link href="/friendList" asChild>
          <CustomListItem icon="bar-chart" title="Reports" />
        </Link>
      </View>

      <Button
        title="Logout"
        buttonStyle={style.logoutButton}
        onPress={handleLogout}
      />
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
});

export default Profile;
