import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiAlignJustify } from "react-icons/fi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState(""); // State for user's display name
  const navigate = useNavigate();

  // Fetch user details from localStorage
  useEffect(() => {
    const storedDisplayName = localStorage.getItem("displayName");
    if (storedDisplayName) {
      setDisplayName(storedDisplayName);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/api/v1/logout`);
      console.log(response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("displayName");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-700">
          Welcome, {displayName || "Admin"}
        </h1>
      </div>

      {/* Dropdown Menu */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
        >
          <FiAlignJustify className="text-2xl text-gray-500 hover:text-gray-600" />
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
            <ul className="py-1">
              <li>
                <button
                  className="block px-4 py-2 text-sm md:text-base text-gray-700 hover:bg-gray-200 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
