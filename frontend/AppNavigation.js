import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { useTheme } from "react-native-paper";
import AnalyticsView from "./AnalyticsView";
import ProfileView from "./ProfileView";
import QRcodeNavigation from "./QRcodeNavigation";
import facultyInputNavigation from "./facultyInputNavigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="google-analytics" size={size} color={color} />
        )}
        label="Analytics"
        onPress={() => props.navigation.navigate("Analytics")}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="qrcode-scan" size={size} color={color} />
        )}
        label="QR Code"
        onPress={() => props.navigation.navigate("QR Code")}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="plus-circle-outline" size={size} color={color} />
        )}
        label="Data Input"
        onPress={() => props.navigation.navigate("Data Input")}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <Drawer.Navigator
      initialRouteName="Analytics"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Analytics" component={AnalyticsView} />
      <Drawer.Screen name="QR Code" component={QRcodeNavigation} />
      <Drawer.Screen name="Data Input" component={facultyInputNavigation} />
      <Drawer.Screen name="Profile" component={ProfileView} />
    </Drawer.Navigator>
  );
}
