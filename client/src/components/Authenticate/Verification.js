import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../Shared/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { FRONTEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../Shared/Loading";

const BASE_URL = FRONTEND_URL;

export default function Verification() {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState();
  const param = useRoute().params;
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(param.user);
  }, []);

  const verifyUser = async () => {
    if (user.pin !== Number(code)) {
      Alert.alert("This pin is invalid.");
      return;
    }
    setLoading(true);
    if (user.isItSingUp) {
      try {
        const response = await axios.post(
          `${BASE_URL}/signup`,
          {
            name: user.name,
            email: user.email,
            password: user.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        AsyncStorage.setItem("token", response.data.authToken);
        Alert.alert("Your registration is successful.");
        navigator.navigate("Login");
        setLoading(false);
        return;
      } catch (error) {
        Alert.alert(error.response.data.message);
        setLoading(false);
        return;
      }
    }
    navigator.navigate("Reset", { email: user.email });
    setLoading(false);
    return;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <ImageBackground
          source={require("../../../assets/register.png")}
          style={{ flex: 1, justifyContent: "center", width: "100%" }}
          resizeMode="cover"
        >
          <View style={styles.loginPage}>
            <Text style={styles.heading}>
              Verification pin has been sent to your email id.
            </Text>
            <View style={styles.field}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.black}
              />
              <TextInput
                placeholder="Enter 6 digit pin"
                value={code}
                style={styles.input}
                selectionColor={Colors.grey}
                onChangeText={(code) => setCode(code)}
                maxLength={6}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Verify me"
                color={Colors.bayernBlue}
                onPress={verifyUser}
              />
            </View>
          </View>
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginPage: {
    width: "100%",
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  heading: {
    width: "90%",
    fontFamily: "Quicksand-Bold",
    fontSize: 25,
    color: Colors.bayernBlue,
    marginBottom: 30,
  },
  field: {
    width: "90%",
    display: "flex",
    justifyContent: "flex-start",
    gap: 2,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  input: {
    width: "80%",
    margin: 10,
    padding: 5,
    fontSize: 15,
    fontFamily: "Quicksand-Regular",
  },
  button: {
    width: "90%",
    marginVertical: 20,
  },
});
