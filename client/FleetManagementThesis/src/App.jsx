import React from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AddDriver from "./pages/Add-Driver.jsx";
import AddTruck from "./pages/Add-Truck.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";

// Defining router using createBrowserRouter and createRoutesFromElements
const router = createBrowserRouter(
  createRoutesFromElements(
    //MainLayout component as a parent route
    <Route path="/" element={<MainLayout />}>
      {/* Children Components */}
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/add-drivers" element={<AddDriver />}></Route>
      <Route path="/add-trucks" element={<AddTruck />}></Route>

      {/* Catch all route for all page missing or not existing */}
      <Route path="*" element={<NotFoundPage />}></Route>
    </Route>
  )
);

// App Component returning RouterProvider with the router
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
