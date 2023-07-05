// Tabs.js
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import AnalyticsView from "./AnalyticsView";
import ProfileView from "./ProfileView";

import React, { useContext } from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import QRcodeNavigation from "./QRcodeNavigation";
import facultyInputNavigation from "./facultyInputNavigation";
import QRcodeView from "./QRcodeView";
import StudentMasteryInputView from "./StudentMasteryInputView";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
import LoginPage from "./loginPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileIcon = ({ navigation }) => {
  // display user icon and navigate to profile view when pressed
  return (
    <TouchableOpacity onPress={() => navigation.navigate("ProfileView")}>
      <Icon name="account-circle-outline" size={30} color="#000" />
    </TouchableOpacity>
  );
};

const StackNavigator = () => {
  // get isLoggedIn from context and navigate to login screen if user is not logged in
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ProfileView" component={ProfileView} />
        </>
      ) : (
        <Stack.Screen name="Login">
          {(props) => (
            <LoginPage {...props} onLogin={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

function TabNavigator() {
  // display tabs for analytics, QR code, and data input
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: colors.primary,
      }}
      tabBarOptions={{
        activeTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="Analytics"
        component={AnalyticsView}
        options={{
          tabBarIcon: (props) => (
            <Icon name="google-analytics" size={24} color={props.color} />
          ),
          headerRight: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="QR Code"
        component={QRcodeNavigation}
        options={{
          tabBarIcon: (props) => (
            <Icon name="qrcode-scan" size={24} color={props.color} />
          ),
          headerRight: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="Data Input"
        // component={StudentMasteryInputView} // for student view
        component={facultyInputNavigation} // for faculty view
        options={{
          tabBarIcon: (props) => (
            <Icon name="plus-circle-outline" size={24} color={props.color} />
          ),
          headerRight: () => <ProfileIcon navigation={navigation} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default StackNavigator;

// styling for tabs
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
