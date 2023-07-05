import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Alert,
  Text,
  View,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";

import { BarCodeScanner } from "expo-barcode-scanner";

export default function QRcodeScannerView() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("Not yet scanned");
  const [isScannedIn, setIsScannedIn] = useState(false);
  const [timeIn, setTimeIn] = useState(0);
  const [timeOut, setTimeOut] = useState(0);
  const [dateString, setDateString] = useState("");

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const fetchIDFromName = async (name) => {
    try {
      const response = await axios.get("http://192.168.4.63:5000/api/users");
      const user = response.data.find((user) => user.name === name);
      return user.user_id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      if (isScannedIn && timeIn === 0) {
        const d1 = new Date();
        const minutesSinceMidnight = d1.getHours() * 60 + d1.getMinutes();
        setTimeIn(minutesSinceMidnight);
        setDateString(
          `${d1.getFullYear()}-${
            d1.getMonth() + 1
          }-${d1.getDate()} ${d1.getHours()}:${d1.getMinutes()}`
        );
      } else if (!isScannedIn && timeIn !== 0) {
        const d2 = new Date();
        const minutesSinceMidnight2 = d2.getHours() * 60 + d2.getMinutes();
        setTimeOut(minutesSinceMidnight2);
        const dateString2 = `${d2.getFullYear()}-${
          d2.getMonth() + 1
        }-${d2.getDate()} ${d2.getHours()}:${d2.getMinutes()}`;

        try {
          await axios.post("http://192.168.4.63:5000/api/study_hours", {
            userId: 1,
            datetimeOfLogIn: dateString,
            datetimeOfLogOut: dateString2,
            durationOfStudy: timeOut - timeIn,
          });
          Alert.alert("Data saved successfully");
          //reset timeIn and timeOut
          setTimeIn(0);
          setTimeOut(0);
        } catch (error) {
          console.error("Failed to save data:", error);
        }
      }
    };

    saveData();
  }, [isScannedIn]);

  const handlePress = () => {
    Linking.openURL(data);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    setIsScannedIn(!isScannedIn);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={() => askForCameraPermission()} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (scanned) {
    return (
      <View style={styles.container}>
        <Text>Scanned Data:</Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={{ color: "blue", textDecorationLine: "underline" }}>
            {data}
          </Text>
        </TouchableOpacity>
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    // display a camera view and a border to scan QR code
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.borderTop} />
        <View style={styles.borderRight} />
        <View style={styles.borderBottom} />
        <View style={styles.borderLeft} />
      </View>
      <Text>Scan QR code</Text>
      <StatusBar style="auto" />
    </View>
  );
}
// styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    position: "relative",
    width: "80%",
    aspectRatio: 1,
  },
  borderTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "red", // Customize the color of the border
  },
  borderRight: {
    position: "absolute",
    top: 2,
    right: 0,
    bottom: 2,
    width: 2,
    backgroundColor: "red", // Customize the color of the border
  },
  borderBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "red", // Customize the color of the border
  },
  borderLeft: {
    position: "absolute",
    top: 2,
    left: 0,
    bottom: 2,
    width: 2,
    backgroundColor: "red", // Customize the color of the border
  },
});
