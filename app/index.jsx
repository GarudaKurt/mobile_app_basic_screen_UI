import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {useAuthStore} from "./zustand/zustand"; // import the Zustand store

const Index = () => {
  const testInputs = /^[^<>&/=]*$/;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hideShow, setHideShow] = useState(true);
  const [wrongPass, setWrongPass] = useState(false);
  const [warnMessage, setWarnMessage] = useState("");

  const signIn = useAuthStore((state) => state.signIn);

  const securityTest = (text) => {
    const isValid = testInputs.test(text);
    return isValid;
  };

  const passHideShow = () => {
    setHideShow(!hideShow);
  };

  const handleCredentials = async () => {
    try {
      //Validate both email and password
      if (!securityTest(email) || !securityTest(password)) {
        setWarnMessage("Invalid email or password format");
        return;
      }
        const success = await signIn(email, password)
        console.log("Value of ",success)
        if(success)
          router.push("(tabs)");
        else
          setWarnMessage("Invalid email or password");
    } catch (error) {
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
              <Pressable style={styles.buttons} onPress={handleCredentials}>
                <Text style={styles.buttonTitle}>Login</Text>
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
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    width: "100%",
    alignItems: "center",
  },
  inputShadowBox: {
    fontSize: 15,
    backgroundColor: "#ffff",
    borderRadius: 10,
    height: 50,
    width: 350,
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
    paddingLeft: 19,
    paddingRight: 45,
  },
  resetTypo: {
    color: "#00bee5",
    textAlign: "left",
    fontSize: 15,
    fontFamily: "Gudea-Bold",
    fontWeight: "700",
  },
  svgrepocomIconLayout: {
    height: 40,
    width: 40,
    overflow: "hidden",
  },
  designer11: {
    marginTop: 100,
    width: 200,
    height: 230,
  },
  welcomeBack: {
    fontSize: 45,
    height: 70,
    marginTop: 16,
    width: 350,
    textAlign: "center",
    color: "#000",
    fontFamily: "Gudea-Bold",
    fontWeight: "800",
  },
  inputFormChild: {
    alignItems: "center",
    paddingHorizontal: 19,
    paddingVertical: 14,
  },
  inputFormItem: {
    alignItems: "center",
    paddingHorizontal: 19,
    paddingVertical: 14,
  },
  inputContainer: {
    position: "relative",
    margin: 8,
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  forgotPassword: {
    color: "#92a0a9",
    fontWeight: "700",
  },
  reset: {
    marginLeft: 5,
  },
  forgotPasswordParent: {
    height: 30,
    marginTop: 16,
    flexDirection: "row",
  },
  inputForm: {
    height: 115,
    marginTop: 16,
    alignItems: "center",
  },
  signInWrapper: {
    marginTop: 16,
  },
  signUpContainer: {
    marginTop: 60,
    flexDirection: "row",
    columnGap: 8,
  },
  orParent: {
    marginTop: 16,
    alignItems: "center",
  },
  loginscreen: {
    backgroundColor: "#f2e3a9",
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "center",
  },
  errorText: {
    color: "#CA0404",
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  buttons: {
    backgroundColor: "#00BEE5",
    borderColor: "transparent",
    borderRadius: 30,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 350,
    height: 45,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    fontWeight: "700",
    fontSize: 24,
    fontFamily: "Gudea-Bold",
    color: "rgba(255, 255, 255, 1)",
  },
});

export default Index;
