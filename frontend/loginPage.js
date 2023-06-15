import React from "react";
import { View, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginPage = () => {
  const navigation = useNavigation();
  const handleImageClick = () => {
    navigation.navigate("Analytics");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handleImageClick}>
        <Image
          source={require("./assets/google-signin-button.png")}
          style={{ width: 382, height: 92 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;
