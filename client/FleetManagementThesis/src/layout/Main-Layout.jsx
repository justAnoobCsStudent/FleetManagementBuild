import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

// Returning MainLayout
const MainLayout = () => {
  return (
    <>
      {/* Main Layout Wrapper */}
      <div className="flex flex-col h-screen">
        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
