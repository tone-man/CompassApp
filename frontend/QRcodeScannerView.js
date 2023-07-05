import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";

export default function QRcodeScannerView() {
  // set states for camera permission, scanned, data, isScannedIn, timeIn, timeOut
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("Not yet scanned");
  const [isScannedIn, setIsScannedIn] = useState(false);
  const [timeIn, setTimeIn] = useState(0);
  const [timeOut, setTimeOut] = useState(0);

  // ask for camera permission if not yet granted
  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  // check if scanned in or scanned out and set timeIn or timeOut accordingly
  useEffect(() => {
    if (isScannedIn) {
      var d = new Date();
      const minutesSinceMidnight = d.getHours() * 60 + d.getMinutes(); // calculate time in minutes since midnight
      setTimeIn(minutesSinceMidnight); // set timeIn to minutes since midnight
      console.log("timeIn: " + minutesSinceMidnight);
    } else {
      var d = new Date();
      const minutesSinceMidnight2 = d.getHours() * 60 + d.getMinutes(); // calculate time in minutes since midnight
      setTimeOut(minutesSinceMidnight2); // set timeOut to minutes since midnight
      console.log("timeOut: " + minutesSinceMidnight2);
      console.log(timeOut - timeIn); // calculate time spent in the study room
      // post request
    }
  }, [isScannedIn, timeIn, timeOut]);

  const handlePress = () => {
    Linking.openURL(data);
  };

  // handle barcode scanned
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    setIsScannedIn(!isScannedIn);
    // ...
  };
  // if camera permission not granted, ask for permission
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
    // if scanned, display scanned data and a button to scan again
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
