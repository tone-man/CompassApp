import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { RNCamera } from "react-native-vision-camera";
import QRCodeScanner from "react-native-qrcode-scanner";

const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");

  const handleQRCodeScanned = ({ data }) => {
    setScanning(false);
    setScannedData(data);
  };

  useEffect(() => {
    RNCamera.requestCameraPermission();
  }, []);

  const startScan = () => {
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <QRCodeScanner onRead={handleQRCodeScanned} />
      ) : (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>{scannedData}</Text>
          <Button title="Scan QR Code" onPress={startScan} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  scanResultContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scanResultText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Scanner;
