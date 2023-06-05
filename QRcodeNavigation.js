import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, StyleSheet } from "react-native";
import QRcodeView from "./QRcodeView";

const Tab = createMaterialTopTabNavigator();

const QrcodeScanner = () => {
  return (
    <View style={styles.container}>
      <Text>Scanner!</Text>
    </View>
  );
};

function QRcodeNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="QRcodeScanner" component={QrcodeScanner} />
      <Tab.Screen name="QRcodeView" component={QRcodeView} />
    </Tab.Navigator>
  );
}

export default QRcodeNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
