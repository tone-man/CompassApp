import { Image } from "react-native";

export default function QRCode() {
  return (
    <Image
      source={require("./assets/QR_Code.png")}
      style={{
        resizeMode: "center",
        paddingTop: 0,
        width: 300,
        height: 300,
      }}
    />
  );
}
