// Tabs.js
import { TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Analytics from "./analytics";
import QRCode from "./qrCode";
import Profile from "./Profile";
import Scanner from "./scanner";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Octicons";
import Icon1 from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileIcon = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <Icon1 name="person-circle-outline" size={30} color="#000" />
    </TouchableOpacity>
  );
};

function TabNavigator() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: (props) => (
            <Icon name="graph" size={24} color={props.color} />
          ),
          headerLeft: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCode}
        options={{
          tabBarIcon: (props) => (
            <Icon1 name="ios-qr-code-outline" size={24} color={props.color} />
          ),
          headerLeft: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={Scanner}
        options={{
          tabBarIcon: (props) => (
            <Icon1 name="camera" size={24} color={props.color} />
          ),
          headerLeft: () => <ProfileIcon navigation={navigation} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Tabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Go Back"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
