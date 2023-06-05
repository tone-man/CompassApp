import React from "react";
import { View, Text, Button } from "react-native";

const ProfileView = () => {
  return (
    <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
      <View style={{ backgroundColor: "#1300FF", borderRadius: 10 }}>
        <Button
          title="LOG OUT"
          color="#ECFF00"
          onPress={() => console.log("Button with adjusted color pressed")}
        />
      </View>
    </View>
  );
};

export default ProfileView;
