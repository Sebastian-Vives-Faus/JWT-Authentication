import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  // Login
  const login = async (token) => {
    await setIsAuthenticated(true);
    // Now that we have our token, we save it in local storage
    await localStorage.setItem("token", token);
    navigate("/dashboard");
  };

  // Login
  const logout = async () => {
    await setIsAuthenticated(false);
    await localStorage.removeItem("token");
  };

  // Verify
  const verifyToken = async () => {};

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
