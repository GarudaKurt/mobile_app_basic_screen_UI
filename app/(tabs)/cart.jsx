import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput,
        Modal, ScrollView, useWindowDimensions,
        Pressable } from "react-native";

const Carts = () => {
    return (
        <View style={style.modalContainer}>
            <View style={style.modalView}>
                <Text style={style.modalTitle}>Add Product</Text>
                <ScrollView 
                    contentContainerStyle={style.scrollViewContent}
                    style={[style.scrollView]}
                >
                </ScrollView>
                <Pressable
                    style={style.closeButton}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={style.closeButtonText}>Close</Text>
                </Pressable>
            </View>

        </View>
    )
}

const style = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalView: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    closeButton: {
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 5,
        color: "#FFF",
        fontSize: 16,
    },
    closeButtonText: {
        fontSize: 16,
        color: "#FFF",
        textAlign: "center"
    }
})
export default Carts