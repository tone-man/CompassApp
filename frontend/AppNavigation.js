import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { useTheme, Alert } from "react-native-paper";
import { Linking } from "react-native"; // 1. Import the Linking API
import AnalyticsView from "./AnalyticsView";
import ProfileView from "./ProfileView";
import userTable from "./userTable";
import tableNavigation from "./tableNavigation";
import QRcodeNavigation from "./QRcodeNavigation";
import facultyInputNavigation from "./facultyInputNavigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EditDataNavigator from "./tableNavigation";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { colors } = useTheme();

  // 2. Create a function that will open the email app
  const handleBugReport = () => {
    const email = "compasslearningapplication@gmail.com"; // Replace with your email
    const subject = encodeURIComponent("Bug Report");

    Linking.openURL(`mailto:${email}?subject=${subject}`).catch(() => {
      Alert.alert("Unable to open email app");
    });
  };

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
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="account" size={size} color={color} />
        )}
        label="Profile"
        onPress={() => props.navigation.navigate("Profile")}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="table" size={size} color={color} />
        )}
        label="Table"
        onPress={() => props.navigation.navigate("Edit Data")}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="account-multiple" size={size} color={color} />
        )}
        label="Add/Remove Users"
        onPress={() => props.navigation.navigate("Add/Remove Users")}
      />
      {/* add an option to report a bug */}
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="bug" size={size} color={color} />
        )}
        label="Report a Bug"
        onPress={handleBugReport} // use the function here
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
      <Drawer.Screen name="Edit Data" component={EditDataNavigator} />
      <Drawer.Screen name="Add/Remove Users" component={userTable} />
    </Drawer.Navigator>
  );
}
