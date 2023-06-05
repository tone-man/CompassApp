import { Image } from "react-native";

export default function QRcodeView() {
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
