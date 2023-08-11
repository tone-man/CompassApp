import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./AuthContext";
import loginPage from "./loginPage";
import { ThemeContext } from "./ThemeContext";

const ProfileView = () => {
  const { signOut, user } = useContext(AuthContext); // get signOut from context
  console.log(user);
  const navigation = useNavigation(); // get navigation
  const { theme, setTheme } = useContext(ThemeContext); // get theme and setTheme from context
  const setThemeColor = (color) => {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        primary: color,
      },
    });
  };
  React.useEffect(() => {
    // setThemeColor("blue");
  }, []);

  const handleLogout = () => {
    signOut(); // logout user
    navigation.navigate("Login"); // navigate to login screen
  };

  return (
    // display user icon, username, and logout button
    <PaperProvider>
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={{ uri: user.picture }} // Dynamic image source from user.picture
        />
        <Text>{user.name}</Text>
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
  profileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
