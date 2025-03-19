import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "./zustand/zustand"; // import the Zustand store

const Index = () => {
  const testInputs = /^[^<>&/=]*$/;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hideShow, setHideShow] = useState(true);
  const [wrongPass, setWrongPass] = useState(false);
  const [warnMessage, setWarnMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = useAuthStore((state) => state.signIn);

  const securityTest = (text) => testInputs.test(text);

  const passHideShow = () => setHideShow(!hideShow);

  const handleCredentials = async () => {
    try {
      if (!securityTest(email) || !securityTest(password)) {
        setWarnMessage("Invalid email or password format");
        return;
      }
      setLoading(true);
      const success = await signIn(email, password);
      setLoading(false);
      if (success) router.push("/(tabs)");
      else setWarnMessage("Invalid email or password");
    } catch (error) {
      setLoading(false);
      console.error("Error logging in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginscreen}>
        <Text style={styles.welcomeBack}>Welcome</Text>
        {wrongPass && <Text style={styles.errorText}>{warnMessage}</Text>}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.select({ ios: 8, android: 500 })}
        >
          <View style={styles.inputForm}>
            <TextInput
              style={[styles.inputFormChild, styles.inputShadowBox]}
              placeholder="Email"
              placeholderTextColor="#92a0a9"
              value={email}
              onChangeText={setEmail}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputFormItem, styles.inputShadowBox]}
                placeholder="Password"
                placeholderTextColor="#92a0a9"
                secureTextEntry={hideShow}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={passHideShow}
                style={styles.iconContainer}
              >
                <Ionicons
                  name={hideShow ? "eye-off" : "eye"}
                  size={24}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signInWrapper}>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.buttons}
                onPress={handleCredentials}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonTitle}>Login</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.signUpContainer}>
          <Text style={styles.forgotPassword}>Don’t have an account?</Text>
          <Link href="/register" asChild>
            <Text style={styles.resetTypo}>Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoidingView: { width: "100%", alignItems: "center" },
  inputShadowBox: {
    fontSize: 15,
    backgroundColor: "#ffff",
    borderRadius: 10,
    height: 50,
    width: 350,
    paddingLeft: 19,
    paddingRight: 45,
  },
  resetTypo: { color: "#00bee5", fontSize: 15, fontWeight: "700" },
  welcomeBack: { fontSize: 45, textAlign: "center", color: "#000" },
  inputFormChild: { paddingHorizontal: 19, paddingVertical: 14 },
  inputFormItem: { paddingHorizontal: 19, paddingVertical: 14 },
  inputContainer: { position: "relative", margin: 8, width: "100%" },
  iconContainer: { position: "absolute", right: 15, top: 13 },
  forgotPassword: { color: "#92a0a9", fontWeight: "700" },
  inputForm: { height: 115, marginTop: 16, alignItems: "center" },
  signInWrapper: { marginTop: 16 },
  signUpContainer: { marginTop: 60, flexDirection: "row" },
  loginscreen: { flex: 1, width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#F7EFDA" },
  errorText: { color: "#CA0404", fontWeight: "bold", marginTop: 10 },
  buttonContainer: { width: "100%", alignItems: "center" },
  buttons: {
    backgroundColor: "#00BEE5",
    borderRadius: 30,
    width: 350,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: { fontWeight: "700", fontSize: 24, color: "#fff" },
});

export default Index;