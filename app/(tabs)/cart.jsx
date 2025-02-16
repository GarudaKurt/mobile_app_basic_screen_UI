import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Card } from "@rneui/themed";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { useAuthStore } from "../zustand/zustand";

const Carts = () => {

  const userMonitoringData = useAuthStore((state) => state.userMonitoringData);
  
  const [items, setItems] = useState(userMonitoringData);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setItems(userMonitoringData);
  }, [userMonitoringData]);  

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
        <Text style={styles.text}>{item.energy}</Text>
        <Text style={styles.text}>{item.power}</Text>
        <Text style={styles.text}>{item.voltage}</Text>
      </View>
      <Card.Divider style={{ width: "100%", marginBottom: 8 }} color="#888" width={1} orientation="horizontal" />
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.mainCards}>
        <View style={styles.header}>
          <Text style={styles.title}>Date</Text>
          <Text style={styles.title}>kWh</Text>
          <Text style={styles.title}>Watts</Text>
          <Text style={styles.title}>Voltage</Text>
        </View>
        <Card.Divider style={{ width: "100%", marginBottom: 8 }} color="#888" width={2} orientation="horizontal" />
        
        {/* Make the list scrollable inside a fixed height */}
        <View style={{ maxHeight: 400 }}>
          <FlatList
            data={displayedItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
          />
        </View>
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
