import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import FacultyBehaviorInput from "./FacultyBehaviorInput";
import FacultyMasteryInput from "./FacultyMasteryInput";
import FacultyHourInput from "./FacultyHourInput";

const Tab = createMaterialTopTabNavigator();

function FacultyInputNavigation() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: colors.primary,
        }, // Customize the underline color here
      }}
    >
      <Tab.Screen name="Behavior" component={FacultyBehaviorInput} />
      <Tab.Screen name="Mastery" component={FacultyMasteryInput} />
      {/*<Tab.Screen name="Hours" component={FacultyHourInput} /> */}
    </Tab.Navigator>
  );
}

export default FacultyInputNavigation;
