// Tabs.js
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AnalyticsView = () => {
  return (
    <View style={styles.container}>
      <Text>Analytics!</Text>
    </View>
  );
};

const QRCodeView = () => {
  return (
    <View style={styles.container}>
      <Text>QR Code!</Text>
    </View>
  );
};

const MasteryInputView = () => {
  return (
    <View style={styles.container}>
      <Text>Mastery Input!</Text>
    </View>
  );
};

const ProfileView = () => {
  return (
    <View style={styles.container}>
      <Text>Profile!</Text>
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
          headerLeft: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCodeView}
        options={{
          tabBarIcon: (props) => (
            <Icon name="qrcode-scan" size={24} color={props.color} />
          ),
          headerLeft: () => <ProfileIcon navigation={navigation} />,
        }}
      />
      <Tab.Screen
        name="DataInput"
        component={MasteryInputView}
        options={{
          tabBarIcon: (props) => (
            <Icon name="plus-circle-outline" size={24} color={props.color} />
          ),
          headerLeft: () => <ProfileIcon navigation={navigation} />,
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
