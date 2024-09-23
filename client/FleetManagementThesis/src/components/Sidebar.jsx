import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 p-5 ">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <ul className="mt-5">
        <li className="mt-2 p-2 hover:bg-gray-700 rounded">
          <Link to="/">Dashboard</Link>
        </li>
        <span className="mt-2 text-xl font-semibold">Trucks</span>
        <br />
        <li className="mt-2 p-2 hover:bg-gray-700 rounded">
          <Link to="/view-trucks">View All Trucks</Link>
        </li>
        <li className="mt-2 p-2 hover:bg-gray-700 rounded">
          <Link to="/add-trucks">Add New Truck</Link>
        </li>
        <span className="mt-2 text-xl font-semibold">Drivers</span>
        <br />
        <li className="mt-2 p-2 hover:bg-gray-700 rounded">
          <Link to="view-drivers">View All Drivers</Link>
        </li>
        <li className="mt-2 p-2 hover:bg-gray-700 rounded">
          <Link to="/add-drivers">Add New Driver</Link>
        </li>
        <li className="mt-2 p-2 hover:bg-gray-700 rounded">
          <Link to="view-reports">Reports</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
