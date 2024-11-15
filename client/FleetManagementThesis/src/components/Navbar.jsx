import React, { useState, useEffect } from "react";
import { FiAlignJustify } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../Firebase";
import Modal from "@/components/Modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown
  const [displayName, setDisplayName] = useState(""); // User's display name
  const [alarms, setAlarms] = useState([]); // Store alarms
  const [unreadCount, setUnreadCount] = useState(0); // Count of unread alarms
  const [selectedAlarm, setSelectedAlarm] = useState(null); // For showing detailed alarm info in modal
  const navigate = useNavigate();

  // Fetch user details from localStorage
  useEffect(() => {
    const storedDisplayName = localStorage.getItem("displayName");
    if (storedDisplayName) {
      setDisplayName(storedDisplayName);
    }
  }, []);

  // Fetch alarms from Firestore
  useEffect(() => {
    const alarmsRef = collection(firestore, "alarms");
    const alarmsQuery = query(alarmsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(alarmsQuery, (snapshot) => {
      const fetchedAlarms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlarms(fetchedAlarms);
      setUnreadCount(fetchedAlarms.filter((alarm) => !alarm.isRead).length);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadAlarms = alarms.filter((alarm) => !alarm.isRead);

      const updatePromises = unreadAlarms.map((alarm) =>
        updateDoc(doc(firestore, "alarms", alarm.id), { isRead: true })
      );

      await Promise.all(updatePromises);

      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) => ({ ...alarm, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking alarms as read:", error);
    }
  };

  // Toggle individual notification read/unread state
  const toggleNotificationRead = async (id, isRead) => {
    try {
      await updateDoc(doc(firestore, "alarms", id), { isRead: !isRead });

      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === id ? { ...alarm, isRead: !isRead } : alarm
        )
      );

      setUnreadCount((prevCount) => (isRead ? prevCount + 1 : prevCount - 1));
    } catch (error) {
      console.error("Error toggling notification read state:", error);
    }
  };

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
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 relative z-50">
      {/* Welcome Message */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-700">
          Welcome, {displayName || "Admin"}
        </h1>
      </div>

      {/* Right Section with Notification Bell and Dropdown */}
      <div className="flex items-center space-x-6 relative z-50">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() =>
              setActiveDropdown((prev) =>
                prev === "notifications" ? null : "notifications"
              )
            }
            className="relative focus:outline-none"
          >
            <BellIcon className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {activeDropdown === "notifications" && (
            <div
              className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 border border-gray-300 p-4 flex flex-col"
              style={{ maxHeight: "350px" }}
            >
              <ul className="overflow-y-auto flex-grow mb-4">
                {alarms.length > 0 ? (
                  alarms.map((alarm) => (
                    <li
                      key={alarm.id}
                      className={`p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                        alarm.isRead ? "bg-gray-100" : "bg-white"
                      }`}
                      onClick={() => setSelectedAlarm(alarm)}
                    >
                      <div>
                        <p className="text-sm font-medium">{alarm.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alarm.timestamp.toDate()).toLocaleString()}
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {alarm.isRead ? (
                              <CheckCircleIcon
                                className="h-5 w-5 text-green-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNotificationRead(
                                    alarm.id,
                                    alarm.isRead
                                  );
                                }}
                              />
                            ) : (
                              <XCircleIcon
                                className="h-5 w-5 text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNotificationRead(
                                    alarm.id,
                                    alarm.isRead
                                  );
                                }}
                              />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {alarm.isRead ? "Mark as Unread" : "Mark as Read"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm">
                    No alarms found.
                  </li>
                )}
              </ul>
              <button
                onClick={markAllAsRead}
                className="sticky bottom-0 bg-white w-full text-sm flex items-center justify-center hover:text-blue-800 group"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1 group-hover:text-green-500" />
                Mark all read
              </button>
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() =>
              setActiveDropdown((prev) => (prev === "menu" ? null : "menu"))
            }
            className="flex items-center cursor-pointer"
          >
            <FiAlignJustify className="text-2xl text-gray-500 hover:text-gray-600" />
          </button>

          {activeDropdown === "menu" && (
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

      {/* Alarm Details Modal */}
      {selectedAlarm && (
        <Modal onClose={() => setSelectedAlarm(null)}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Alarm Details</h2>
            <XIcon
              className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedAlarm(null)}
            />
          </div>
          <p>
            <strong>Message:</strong> {selectedAlarm.message}
          </p>
          <p>
            <strong>Type:</strong> {selectedAlarm.type}
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(selectedAlarm.timestamp.toDate()).toLocaleString()}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
