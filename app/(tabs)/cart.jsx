import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Card } from "@rneui/themed";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { collection, getDocs } from "firebase/firestore";
import { database, firestore, auth } from "../config/firebaseConfig";
import { useAuthStore } from "../zustand/zustand";

const Carts = () => {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.uid) {
      fetchMonitoringData();
    }
  }, [user]);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const userMonitoringCollectionRef = collection(firestore, "users", user.uid, "monitoring");
      const querySnapshot = await getDocs(userMonitoringCollectionRef);

      const data = querySnapshot.docs.map((doc) => {
        const entry = doc.data();
        const pumpCount = (entry.sensor1 < 70 || entry.sensor2 < 70) ? 1 : 0;
        return {
          id: doc.id,
          ...entry,
          pump: pumpCount,
        };
      });

      setItems(data);
      setDisplayedItems(data.slice(0, itemsPerPage));
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisplayedItems(items.slice(0, itemsPerPage * page));
  }, [items, page]);

  const loadMoreItems = () => {
    if (displayedItems.length < items.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const renderRightActions = (progress, dragX, index) => (
    <View style={styles.actionsContainer}>
      <RectButton style={styles.deleteButton} onPress={() => onDelete(index)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </RectButton>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, index)}>
      <View style={styles.row}>
        <Text style={styles.text}>{item.date}</Text>
        <Text style={styles.text}>{item.sensor1}</Text>
        <Text style={styles.text}>{item.sensor2}</Text>
        <Text style={styles.text}>{item.sensor3}</Text>
        <Text style={styles.text}>{item.pump}</Text>
      </View>
      <Card.Divider style={{ width: "100%", marginBottom: 8 }} color="#888" width={1} orientation="horizontal" />
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.mainCards}>
        <View style={styles.header}>
          <Text style={styles.title}>Date</Text>
          <Text style={styles.title}>Sensor 1</Text>
          <Text style={styles.title}>Sensor 2</Text>
          <Text style={styles.title}>Sensor 3</Text>
          <Text style={styles.title}>Pump</Text>
        </View>
        <Card.Divider style={{ width: "100%", marginBottom: 8 }} color="#888" width={2} orientation="horizontal" />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{ maxHeight: 400 }}>
            <FlatList
              data={displayedItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              onEndReached={loadMoreItems}
              onEndReachedThreshold={0.5}
            />
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  mainCards: {
    width: "90%",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 5
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  text: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  actionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Carts;
