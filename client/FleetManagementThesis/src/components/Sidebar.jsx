import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { GrDashboard } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import {
  PiTruckDuotone,
  PiPlusCircleBold,
  PiArrowSquareLeftBold,
} from "react-icons/pi";
import { RiUserSearchLine, RiUserAddLine } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const linkClass = ({ isActive }) => {
    return isActive
      ? "text-white bg-black mt-2 p-2 rounded block"
      : "mt-2 p-2 hover:bg-gray-700 rounded block text-white";
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen${
        isOpen ? "w-64" : "w-20"
      } p-5 flex flex-col justify-between transition-width duration-300`}
    >
      <div className="flex-grow">
        <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}>
          Admin Dashboard
        </h1>
        <ul className="mt-5">
          <NavLink to="/" className={linkClass}>
            <div className="flex items-center">
              <GrDashboard className="text-2xl" />
              {isOpen && <span className="ml-2">Dashboard</span>}
            </div>
          </NavLink>
          <div className="mt-5">
            <span className={`text-xl font-semibold ${!isOpen && "hidden"}`}>
              Trucks
            </span>
          </div>
          <NavLink to="/view-trucks" className={linkClass}>
            <div className="flex items-center">
              <PiTruckDuotone className="text-2xl" />
              {isOpen && <span className="ml-2">View All Trucks</span>}
            </div>
          </NavLink>
          <NavLink to="/add-trucks" className={linkClass}>
            <div className="flex items-center">
              <PiPlusCircleBold className="text-2xl" />
              {isOpen && <span className="ml-2">Add New Truck</span>}
            </div>
          </NavLink>

          <div className="mt-5">
            <span
              className={`mt-2 text-xl font-semibold ${!isOpen && "hidden"}`}
            >
              Drivers
            </span>
          </div>

          <NavLink to="/view-drivers" className={linkClass}>
            <div className="flex items-center">
              <RiUserSearchLine className="text-2xl" />
              {isOpen && <span className="ml-2">View All Drivers</span>}
            </div>
          </NavLink>
          <NavLink to="/add-drivers" className={linkClass}>
            <div className="flex items-center">
              <RiUserAddLine className="text-2xl" />
              {isOpen && <span className="ml-2">Add New Driver</span>}
            </div>
          </NavLink>
          <NavLink to="/view-reports" className={linkClass}>
            <div className="flex items-center">
              <TbReport className="text-2xl" />
              {isOpen && <span className="ml-2">Report</span>}
            </div>
          </NavLink>
        </ul>
      </div>

      <div className="flex justify-center">
        <button className="text-3xl" onClick={toggleSidebar}>
          <PiArrowSquareLeftBold
            className={`${
              isOpen ? "" : "rotate-180"
            } transition-transform duration-300`}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
