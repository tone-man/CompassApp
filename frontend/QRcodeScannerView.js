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
// import SoundPlayer from "react-native-sound-player";

import { BarCodeScanner } from "expo-barcode-scanner";

export default function QRcodeScannerView() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("Not yet scanned");

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status == "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handlePress = () => {
    Linking.openURL(data);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // SoundPlayer.playSoundFile("sound", "mp3");
    setData(data);
    console.log("Type: " + type + "\nData: " + data);
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
