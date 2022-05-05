import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Hooks
import { useAuth } from "../context/AuthProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [name, setName] = useState("");

  const getName = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      });

      const parseResponse = await response.json();
      setName(parseResponse.user_name);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getName();
  });

  const buttonHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <Fragment>
      <h1>Dashboard</h1>
      <p>Welcome {name}</p>
      <button onClick={buttonHandler}>Logout</button>
    </Fragment>
  );
};

export default Dashboard;
