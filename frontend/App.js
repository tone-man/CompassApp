// https://www.youtube.com/watch?v=km1qm1Zz2lY&ab_channel=PradipDebnath
import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import StackNavigator from "./AppNavigation";
import { AppRegistry } from "react-native";

const Main = () => (
  <PaperProvider>
    <App />
  </PaperProvider>
);

AppRegistry.registerComponent("MyApp", () => Main);

const App = () => {
  return (
    //<NavigationContainer>
    <NavigationContainer theme={DarkTheme}>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
