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
import Login from "./pages/Login.jsx";
import IsLoggedIn from "./components/IsLoggedIn.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlarmListener from "./components/AlarmListener.jsx";
import AuthListener from "./components/AuthListener.jsx";

// Defining router using createBrowserRouter and createRoutesFromElements
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route
        path="/"
        element={
          <MainLayout>
            <AuthListener />
          </MainLayout>
        }
      >
        {/* Children Components */}
        <Route
          path="/dashboard"
          element={
            <IsLoggedIn>
              <Dashboard />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/add-drivers"
          element={
            <IsLoggedIn>
              <AddDriver />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/add-trucks"
          element={
            <IsLoggedIn>
              <AddTruck />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-drivers"
          element={
            <IsLoggedIn>
              <ViewDrivers />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-trucks"
          element={
            <IsLoggedIn>
              <ViewTrucks />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-reports"
          element={
            <IsLoggedIn>
              <ViewReports />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-truck/:id"
          element={
            <IsLoggedIn>
              <ViewTruck />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-driver/:id"
          element={
            <IsLoggedIn>
              <ViewDriver />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        <Route
          path="/edit-truck/:id"
          element={
            <IsLoggedIn>
              <EditTruck />
              <AlarmListener />
            </IsLoggedIn>
          }
        />
        {/* Catch all route for all pages missing or not existing */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </>
  )
);

// App Component returning RouterProvider with the router
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
