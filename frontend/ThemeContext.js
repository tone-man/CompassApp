import React from "react";
import { DefaultTheme } from "react-native-paper";

export const ThemeContext = React.createContext({
  theme: DefaultTheme,
  setTheme: () => {},
});
