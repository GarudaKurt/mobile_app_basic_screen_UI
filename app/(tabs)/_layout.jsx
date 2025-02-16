import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Importing icons
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hides the header at the top
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // Floating tab bar for iOS
          },
          default: {},
        }),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Reports Tab */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" color={color} size={size} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
