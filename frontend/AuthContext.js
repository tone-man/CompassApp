import React, { useState, createContext } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Add user state
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "545940878010-lj3jqd91qbp66mmtsovjjbvo9dh5kofv.apps.googleusercontent.com",
    iosClientId:
      "545940878010-6vkqmrus1q7m1v3ggh7g0gv9hi6t9n3u.apps.googleusercontent.com",
    webClientId:
      "545940878010-4k8fte3ppk17e80alki9485mq6pi6e10.apps.googleusercontent.com",
    expoClientId:
      "545940878010-4k8fte3ppk17e80alki9485mq6pi6e10.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    handleSignIn();
  }, [response]);

  // Define the signIn function
  const signIn = async () => {
    await promptAsync();
  };

  const handleSignIn = async () => {
    const storedUser = await AsyncStorage.getItem("@user");
    if (!storedUser) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUser(JSON.parse(storedUser)); // Set user state if user is found in async storage
      setIsLoggedIn(true);
      console.log("Stored user info:", storedUser);
    }
  };

  const getUserInfo = async (accessToken) => {
    if (!accessToken) return;
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();
      await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
      setUser(userInfo); // Set user state if user info is successfully fetched
      setIsLoggedIn(true);
    } catch (e) {
      // handle error
    }
  };

  // Define the signOut function
  const signOut = () => {
    AsyncStorage.removeItem("@user"); // Remove user from async storage
    setUser(null); // Clear user state
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
