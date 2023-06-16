import React, { useContext } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./AuthContext";

const LoginPage = ({ onLogin }) => {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const handleImageClick = () => {
    signIn();
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
