import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./AuthContext";
import LoginPage from "./loginPage";

const ProfileView = () => {
  const { signOut, user } = useContext(AuthContext); // get signOut from context
  const navigation = useNavigation(); // get navigation

  const handleLogout = () => {
    signOut(); // logout user
    navigation.navigate("Login"); // navigate to login screen
  };

  return (
    // display user icon, username, and logout button
    <PaperProvider>
      <View style={styles.container}>
        <Icon name="account-circle-outline" size={300} color="#000" />
        <Text> {user.name} </Text>
        <Button
          style={styles.button}
          mode="contained"
          title="LOG OUT"
          onPress={handleLogout} // logout when button is pressed
        >
          Log Out
        </Button>
      </View>
    </PaperProvider>
  );
};

export default ProfileView;
// styling for ProfileView
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  button: {
    width: "100%",
  },
});
