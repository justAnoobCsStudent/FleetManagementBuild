import React from "react";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import AddDriver from "./pages/Add-Driver.jsx";
import AddTruck from "./pages/Add-Truck.jsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-y-scroll bg-gray-100 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/add-drivers" element={<AddDriver />}></Route>
                <Route path="/add-trucks" element={<AddTruck />}></Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
