import { Image, StyleSheet, View } from "react-native";

export default function QRcodeView() {
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/QR_Code.png")}
        style={{
          resizeMode: "center",
          paddingTop: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
