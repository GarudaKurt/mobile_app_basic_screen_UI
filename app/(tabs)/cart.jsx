import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Carts = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    price: "",
    quantity: "",
  });
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update productDetails whenever currentIndex changes
  useEffect(() => {
    if (items[currentIndex]) {
      setProductDetails(items[currentIndex]);
    }
  }, [currentIndex]);

  const handleInputChange = (field, value) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const addItems = () => {
    if (
      !productDetails.id ||
      !productDetails.name ||
      !productDetails.price ||
      !productDetails.quantity
    ) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Add item to the list
    setItems((prevItems) => {
      const updatedItems = [...prevItems, productDetails];
      setProductDetails({ id: "", name: "", price: "", quantity: "" });
  
      // Correctly set currentIndex after the new item is added
      setCurrentIndex(updatedItems.length - 1); // Update to the new item index
      return updatedItems;
    });
  };
  

  const handleSwipe = (direction) => {
    if (direction === "next" && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>Open Modal</Text>
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
                    <Pressable
                        onPress={() => setModalVisible(false)}
                    >
                        <AntDesign
                            name="close"
                            size={28}
                            color="black"
                        />
                    </Pressable>
                </View>
              <View style={styles.exitButton}>
                <Pressable
                    onPress={()=>{}}
                >
                    <AntDesign
                    name="check"
                    size={28}
                    color="black"
                    />
                </Pressable>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID:</Text>
                <TextInput
                  style={styles.input}
                  value={productDetails.id}
                  onChangeText={(text) => handleInputChange("id", text)}
                  placeholder="Enter product ID"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={productDetails.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Enter product name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price:</Text>
                <TextInput
                  style={styles.input}
                  value={productDetails.price}
                  onChangeText={(text) => handleInputChange("price", text)}
                  placeholder="Enter product price"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Qty:</Text>
                <TextInput
                  style={styles.input}
                  value={productDetails.quantity}
                  onChangeText={(text) => handleInputChange("quantity", text)}
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
                <Text>{currentIndex + 1} / {items.length}</Text>
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
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
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
});

export default Carts;
