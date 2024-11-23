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
  useLocation,
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
import ViewReport from "./pages/View-Report.jsx";
import GlobalGeofenceHandler from "./components/GlobalGeofenceHandler.jsx";
import PathDistanceListener from "./components/PathDistanceListener.jsx";

// Define the router
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
        {/* Protected Routes */}
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
          path="/view-report/:reportId"
          element={
            <IsLoggedIn>
              <ViewReport />
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

        {/* Fallback Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </>
  )
);

// ToastContainerWrapper Component
const ToastContainerWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return !isLoginPage ? (
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
  ) : null;
};

// App Component
const App = () => {
  return (
    <>
      <PathDistanceListener />
      <GlobalGeofenceHandler />
      <GeoFenceListener /> {/* Geofence logic listener */}
      <AlarmListener /> {/* Alarm logic listener */}
      <RouterProvider router={router}>
        <ToastContainerWrapper />{" "}
        {/* ToastContainer now inside RouterProvider */}
      </RouterProvider>
    </>
  );
};

export default App;
