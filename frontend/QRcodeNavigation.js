import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import QRcodeView from "./QRcodeView";
import QRcodeScannerView from "./QRcodeScannerView";

const Tab = createMaterialTopTabNavigator();

function QRcodeNavigation() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: "#000",
        inactiveTintColor: "#fff",

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="QRcodeScanner" component={QRcodeScannerView} />
      {/*<Tab.Screen name="QRcodeView" component={QRcodeView} /> */}
    </Tab.Navigator>
  );
}

export default QRcodeNavigation;
