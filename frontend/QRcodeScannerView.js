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

// CHANGE THIS AS YOU NEED FOR DEMO

const hostIp = "10.0.0.155";
const port = "5000";

export default function QRcodeScannerView() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("Not yet scanned");
  const [isScannedIn, setIsScannedIn] = useState(false);
  const [timeIn, setTimeIn] = useState(0);
  const [timeOut, setTimeOut] = useState(0);
  const [dateString, setDateString] = useState("");
  const [dateString2, setDateString2] = useState("");

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  useEffect(() => {
    if (isScannedIn && timeIn === 0) {
      const d1 = new Date();
      const minutesSinceMidnight = d1.getHours() * 60 + d1.getMinutes();
      setTimeIn(minutesSinceMidnight);
      setDateString(formatDateString(d1));
    }
  }, [isScannedIn]);

  useEffect(() => {
    if (!isScannedIn && timeIn !== 0) {
      const d2 = new Date();
      const minutesSinceMidnight2 = d2.getHours() * 60 + d2.getMinutes();
      setTimeOut(minutesSinceMidnight2);
      setDateString2(formatDateString(d2));
    }
  }, [isScannedIn]);

  useEffect(() => {
    const saveData = async () => {
      if (timeOut !== 0) {
        try {
          await axios.post("http://" + hostIp + ":" + port +"/api/v1/study-hour-logs/", {
            userId: 1,
            dateTimeOfLogIn: dateString,
            dateTimeOfLogOut: dateString2,
            durationOfStudy: timeOut - timeIn,
          });
          Alert.alert("Data saved successfully");
          setTimeIn(0);
          setTimeOut(0);
        } catch (error) {
          console.error("Failed to save data:", error);
          console.log("user id: 1");
          console.log("datetime of log in: " + dateString);
          console.log("datetime of log out: " + dateString2);
          console.log("duration of study: " + (timeOut - timeIn));
        }
      }
    };
    saveData();
  }, [timeOut]);

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

// Additional helper function to format date string
const formatDateString = (date) => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1) +
    "-" +
    (date.getDate() < 10 ? "0" : "") +
    date.getDate() +
    " " +
    (date.getHours() < 10 ? "0" : "") +
    date.getHours() +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes() +
    ":" +
    (date.getSeconds() < 10 ? "0" : "") +
    date.getSeconds()
  );
};

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
    backgroundColor: "red",
  },
  borderRight: {
    position: "absolute",
    top: 2,
    right: 0,
    bottom: 2,
    width: 2,
    backgroundColor: "red",
  },
  borderBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "red",
  },
  borderLeft: {
    position: "absolute",
    top: 2,
    left: 0,
    bottom: 2,
    width: 2,
    backgroundColor: "red",
  },
});
