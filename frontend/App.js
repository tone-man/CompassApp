// App.js

import React, { useContext } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import StackNavigator from "./AppNavigation";
import { AppRegistry } from "react-native";
import { AuthProvider, AuthContext } from "./AuthContext";
import LoginPage from "./loginPage";

const Main = () => {
  const { isLoggedIn, signIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <LoginPage onLogin={signIn} />;
  }

  return <StackNavigator />;
};

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          {/* <NavigationContainer theme={DarkTheme}> */}
          <Main />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

AppRegistry.registerComponent("MyApp", () => App);

export default App;
