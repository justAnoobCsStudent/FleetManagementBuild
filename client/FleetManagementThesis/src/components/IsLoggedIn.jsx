import React from "react";
import { Navigate } from "react-router-dom";

const IsLoggedIn = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default IsLoggedIn;
