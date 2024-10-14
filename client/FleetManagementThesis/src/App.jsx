import React from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AddDriver from "./pages/Add-Driver.jsx";
import AddTruck from "./pages/Add-Truck.jsx";
import NotFoundPage from "./pages/Not-Found.jsx";
import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layout/Main-Layout.jsx";
import ViewDrivers from "./pages/View-Drivers.jsx";
import ViewTrucks from "./pages/View-Trucks.jsx";
import ViewReports from "./pages/View-Reports.jsx";
import ViewTruck from "./pages/View-Truck.jsx";
import ViewDriver from "./pages/View-Driver.jsx";
import EditTruck from "./pages/Edit-Truck.jsx";

// Defining router using createBrowserRouter and createRoutesFromElements
const router = createBrowserRouter(
  createRoutesFromElements(
    //MainLayout component as a parent route
    <Route path="/" element={<MainLayout />}>
      {/* Children Components */}
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/add-drivers" element={<AddDriver />}></Route>
      <Route path="/add-trucks" element={<AddTruck />}></Route>
      <Route path="/view-drivers" element={<ViewDrivers />}></Route>
      <Route path="/view-trucks" element={<ViewTrucks />}></Route>
      <Route path="/view-reports" element={<ViewReports />}></Route>
      <Route path="/view-truck/:id" element={<ViewTruck />}></Route>
      <Route path="/view-driver/:id" element={<ViewDriver />}></Route>
      <Route path="/edit-truck/:id" element={<EditTruck />}></Route>
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
