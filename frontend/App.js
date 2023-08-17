import React, { useState, useContext } from "react";
import { AppRegistry } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import StackNavigator from "./AppNavigation";
import { AuthProvider, AuthContext } from "./AuthContext";
import LoginPage from "./loginPage";
import { ThemeContext } from "./ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DataContext } from "./DataContext";

const Main = () => {
  const { isLoggedIn, signIn, user } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <LoginPage onLogin={signIn} />;
  }
  return <StackNavigator roleId={user.role_id} />;
};

const App = () => {
  const [theme, setTheme] = useState(DefaultTheme); // maintain theme state
  const [refreshData, setRefreshData] = useState(false);

  return (
    <DataContext.Provider value={{ refreshData, setRefreshData }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <PaperProvider theme={theme}>
              <NavigationContainer theme={theme}>
                <Main />
              </NavigationContainer>
            </PaperProvider>
          </ThemeContext.Provider>
        </AuthProvider>
      </GestureHandlerRootView>
    </DataContext.Provider>
  );
};

AppRegistry.registerComponent("MyApp", () => App);

export default App;
