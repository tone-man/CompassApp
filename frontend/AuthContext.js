import React, { useState, createContext } from "react";

// Create context
export const AuthContext = createContext();

// Create context provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Define the signIn function
  const signIn = () => {
    setIsLoggedIn(true);
  };

  // Define the signOut function
  const signOut = () => {
    setIsLoggedIn(false);
  };

  // Values provided to children components
  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
