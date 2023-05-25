import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Analytics from "./analytics";
import QRCode from "./qrCode";
import Icon from "react-native-vector-icons/Octicons";
import Icon1 from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: (props) => (
            <Icon name="graph" size={24} color={props.color} />
          ),
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCode}
        options={{
          tabBarIcon: (props) => (
            <Icon1 name="ios-qr-code-outline" size={24} color={props.color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
