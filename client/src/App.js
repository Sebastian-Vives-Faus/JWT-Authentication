import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";

// Context
import { useAuth } from "./context/AuthProvider";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const isAuth = async () => {
      console.log("Trying to authenticate...");
      try {
        const response = await fetch("http://localhost:5000/auth/is-verify", {
          method: "GET",
          headers: { token: localStorage.getItem("token") },
        });

        const parseResponse = await response.json();
        console.log(parseResponse);

        // Ternary operator
        parseResponse === true
          ? setIsAuthenticated(true)
          : setIsAuthenticated(false);
      } catch (error) {
        console.error(error.message);
      }
    };

    isAuth();
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Public  Routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
