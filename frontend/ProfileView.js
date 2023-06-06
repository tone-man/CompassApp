import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileView = () => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Icon name="account-circle-outline" size={300} color="#000" />
        <Text> USER </Text>
        <Button
          style={styles.button}
          mode="contained"
          title="LOG OUT"
          onPress={() => console.log("Button with adjusted color pressed")}
        >
          Log Out
        </Button>
      </View>
    </PaperProvider>
  );
};

export default ProfileView;

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
