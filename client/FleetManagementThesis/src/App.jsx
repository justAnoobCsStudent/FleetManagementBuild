import React from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AddDriver from "./pages/Add-Driver.jsx";
import AddTruck from "./pages/Add-Truck.jsx";
import NotFoundPage from "./pages/Not-Found.jsx";
import AddAdmin from "./pages/Add-Admin.jsx";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeoFenceListener from "./components/GeoFenceListener.jsx"; // Always active listener
import AlarmListener from "./components/AlarmListener.jsx"; // Always active listener
import AuthListener from "./components/AuthListener.jsx";
import ViewAdmins from "./pages/View-Admins.jsx";
import EditAdmin from "./pages/Edit-Admin.jsx";

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
            </IsLoggedIn>
          }
        />
        <Route
          path="/add-drivers"
          element={
            <IsLoggedIn>
              <AddDriver />
            </IsLoggedIn>
          }
        />
        <Route
          path="/add-trucks"
          element={
            <IsLoggedIn>
              <AddTruck />
            </IsLoggedIn>
          }
        />
        <Route
          path="/add-admin"
          element={
            <IsLoggedIn>
              <AddAdmin />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-admins"
          element={
            <IsLoggedIn>
              <ViewAdmins />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-drivers"
          element={
            <IsLoggedIn>
              <ViewDrivers />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-trucks"
          element={
            <IsLoggedIn>
              <ViewTrucks />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-reports"
          element={
            <IsLoggedIn>
              <ViewReports />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-truck/:id"
          element={
            <IsLoggedIn>
              <ViewTruck />
            </IsLoggedIn>
          }
        />
        <Route
          path="/view-driver/:id"
          element={
            <IsLoggedIn>
              <ViewDriver />
            </IsLoggedIn>
          }
        />
        <Route
          path="/edit-truck/:id"
          element={
            <IsLoggedIn>
              <EditTruck />
            </IsLoggedIn>
          }
        />
        <Route
          path="/edit-admin/:id"
          element={
            <IsLoggedIn>
              <EditAdmin />
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
      <GeoFenceListener /> {/* Always active listener for geofence events */}
      <AlarmListener /> {/* Always active listener for alarms */}
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
