import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Card } from "@rneui/themed";
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Swipeable, RectButton } from "react-native-gesture-handler";


const Carts = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [items, setItems] = useState([]);
  const [productList, setProductList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items[currentIndex]) {
      const { id, name, price, qty } = items[currentIndex];
      setID(id);
      setName(name);
      setPrice(price);
      setQty(qty);
    }
  }, [currentIndex, items]);

  const addItems = () => {
    if (!id || !name || !price || !qty) {
      alert("Please fill in all fields.");
      return;
    }
  
    const productList = {
      id,
      name,
      price,
      qty,
    };
  
    setItems((prevItems) => [...prevItems, productList]);
  
    setID("");
    setName("");
    setPrice("");
    setQty("");
    setCurrentIndex(items.length + 1);
  };
  
  useEffect(() => {
    if (currentIndex < items.length && items[currentIndex]) {
      const { id, name, price, qty } = items[currentIndex];
      setID(id);
      setName(name);
      setPrice(price);
      setQty(qty);
    } else {
      setID("");
      setName("");
      setPrice("");
      setQty("");
    }
  }, [currentIndex, items]);

  const onDelete = (item) => {
    setProductList((prevItems) => prevItems.filter((i) => i.id !== item.id));
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  const handleSwipe = (direction) => {
    if (direction === "next" && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderRightActions = (progress, dragX, item) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.actionsContainer, { transform: [{ translateX }] }]}>
        <RectButton style={styles.deleteButton} onPress={() => onDelete(item)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
      <View style={styles.row}>
        <Text style={styles.text}>{item.id}</Text>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.text}>{item.price}</Text>
        <Text style={styles.text}>{item.qty}</Text>
      </View>
      <Card.Divider
        style={{ width: "100%", marginBottom: 8 }}
        color="#888"
        width={1}
        orientation="horizontal"
        />
    </Swipeable>
  );


  return (
    <View style={styles.container}>
      
      <Card containerStyle={styles.mainCards}>
            <View style={styles.header}>
                <Text style={styles.title}>ID</Text>
                <Text style={styles.title}>Name</Text>
                <Text style={styles.title}>Price</Text>
                <Text style={styles.title}>Qty</Text>
            </View>
            <Card.Divider
                style={{ width: "100%", marginBottom: 8 }}
                color="#888"
                width={2}
                orientation="horizontal"
            />
            <FlatList
                data={productList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </Card>
      
      <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>Add Product</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalButtons}>
              <View style={styles.modalClose}>
                <Pressable onPress={() => setModalVisible(false)}>
                  <AntDesign name="close" size={28} color="black" />
                </Pressable>
              </View>
              <View style={styles.exitButton}>
                <Pressable>
                  <AntDesign
                    name="check"
                    size={28}
                    color="black"
                    onPress={() => {setProductList(items)}}
                  />
                </Pressable>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID:</Text>
                <TextInput
                  style={styles.input}
                  value={id}
                  onChangeText={(text) => setID(text)}
                  placeholder="Enter product ID"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Enter product name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price:</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={(text) => setPrice(text)}
                  placeholder="Enter product price"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Qty:</Text>
                <TextInput
                  style={styles.input}
                  value={qty}
                  onChangeText={(text) => setQty(text)}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            {items.length > 0 && (
              <View style={styles.paginationContainer}>
                <Pressable onPress={() => handleSwipe("prev")}>
                  <Text style={styles.paginationButton}>Prev</Text>
                </Pressable>
                <Text>
                  {currentIndex + 1} / {items.length}
                </Text>
                <Pressable onPress={() => handleSwipe("next")}>
                  <Text style={styles.paginationButton}>Next</Text>
                </Pressable>
              </View>
            )}

            <Pressable style={styles.additems} onPress={addItems}>
              <Text style={styles.textItems}>Add Items</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 40,
  },
  openButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginRight: 24,
  },
  modalClose: {
    paddingLeft: 20,
    alignItems: "flex-start",
  },
  exitButton: {
    alignItems: "flex-end",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 16,
    flex: 1,
    textAlign: "left",
  },
  input: {
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "#888",
    borderWidth: 1,
    width: "100%",
    paddingLeft: 8,
    height: 40,
    flex: 4,
  },
  additems: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 3,
  },
  textItems: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
    padding: 1,
  },
  paginationButton: {
    color: "#2196F3",
    fontSize: 16,
  },
  mainCards:{
    borderRadius: 10,
    marginLeft: 16,
    marginRight: 16,
    padding: 0,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: "60%",
    width: "100%",
    backgroundColor: "#fff"
  },
  header:{
    width: "100%",
    flexDirection: "row",
    padding: 5,
    backgroundColor: "#F2E3A9",
    borderTopColor: "#fff"
  },
  title: {
    flex: 1,
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Gudea-Regular",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#A9DFBF",
    borderRadius: 5,
    marginBottom: 7,
  },
  text: {
    flex: 1,
    color: "#333",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Gudea-Regular",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 35,
    marginTop: 8,
  },
  deleteButton: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    height: 45,
    width: 80,
    marginTop: -5,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  
});

export default Carts;
