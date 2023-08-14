// LoginPage.js

import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

const LoginPage = ({ onLogin }) => {
  const handleImageClick = () => {
    onLogin();
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
