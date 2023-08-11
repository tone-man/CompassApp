import { DefaultTheme } from "react-native-paper";

let customPrimaryColor = "purple"; // Default color

export const setPrimaryColor = (color) => {
  // check if the string inputted starts with # set the color to the string
  customPrimaryColor = color.startsWith("#") ? color : `#${color}`;
};

export const getTheme = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: customPrimaryColor,
    },
  };

  return theme;
};
