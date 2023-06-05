// Tabs.js
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import AnalyticsView from "./AnalyticsView";
import ProfileView from "./ProfileView";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import QRcodeNavigation from "./QRcodeNavigation";
import QRcodeView from "./QRcodeView";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MasteryInputView = () => {
  return (
    <View style={styles.container}>
      <Text>Mastery Input!</Text>
    </View>
  );
};

const ProfileIcon = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <Icon name="account-circle-outline" size={30} color="#000" />
    </TouchableOpacity>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileView} />
    </Stack.Navigator>
  );
};

function TabNavigator() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Analytics"
        component={AnalyticsView}
        options={{
          tabBarIcon: (props) => (
            <Icon name="google-analytics" size={24} color={props.color} />
          ),
          headerRight: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRcodeNavigation}
        options={{
          tabBarIcon: (props) => (
            <Icon name="qrcode-scan" size={24} color={props.color} />
          ),
          headerRight: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="DataInput"
        component={MasteryInputView}
        options={{
          tabBarIcon: (props) => (
            <Icon name="plus-circle-outline" size={24} color={props.color} />
          ),
          headerRight: () => <ProfileIcon navigation={navigation} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default StackNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
