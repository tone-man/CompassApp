import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import behaviorTable from "./behaviorTable";
import masteryTable from "./masteryTable";
import studyLogTable from "./studyLogTable";

const Tab = createMaterialTopTabNavigator();

function EditDataNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: "#000",
        inactiveTintColor: "#fff",

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Behavior Table" component={behaviorTable} />
      <Tab.Screen name="Mastery Table" component={masteryTable} />
      <Tab.Screen name="Study Log Table" component={studyLogTable} />
    </Tab.Navigator>
  );
}

export default EditDataNavigator;
