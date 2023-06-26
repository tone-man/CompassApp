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
      tabBarOptions={{
        indicatorStyle: { backgroundColor: colors.primary }, // Customize the underline color here
      }}
    >
      <Tab.Screen name="QRcodeScanner" component={QRcodeScannerView} />
      <Tab.Screen name="QRcodeView" component={QRcodeView} />
    </Tab.Navigator>
  );
}

export default QRcodeNavigation;
