import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database"; // Import off for removing listeners
import { database, firestore } from "../Firebase"; // Adjust the path to your Firebase setup
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Firestore imports
import io from "socket.io-client"; // Import WebSocket client
import { toast } from "react-toastify"; // Import toast

const SOCKET_SERVER_URL = "http://localhost:7000"; // Your WebSocket backend URL
const COOLDOWN_PERIOD = 10000; // 10 seconds in milliseconds

const AlarmListener = () => {
  const [lastNotificationTime, setLastNotificationTime] = useState({}); // Store the last notification time for each truck

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL); // Establish WebSocket connection

    const truckIds = ["TRUCK01", "TRUCK02", "TRUCK03"]; // List of truck IDs, replace with your actual IDs

    // Function to handle alarm updates for each truck
    const handleAlarmUpdate = (truckId) => {
      const fuelDataRef = ref(database, `fuel_data/${truckId}`); // Reference for the truck's fuel data

      // Listen to the truck's fuel data changes
      const unsubscribeAlarm = onValue(fuelDataRef, (snapshot) => {
        const fuelData = snapshot.val();

        // Check if fuelData exists and loop through all records for the truck
        if (fuelData) {
          Object.values(fuelData).forEach(async (entry) => {
            const currentTime = Date.now();
            const lastTime = lastNotificationTime[truckId] || 0;

            // Check if the alarm is triggered for the current data entry and cooldown has expired
            if (
              entry.isAlarm === true &&
              currentTime - lastTime > COOLDOWN_PERIOD
            ) {
              console.log(`Alarm triggered for ${truckId}!`);

              // Show toast notification for the current truck's alarm
              toast.error(`Fuel theft detected for ${truckId}!`, {
                toastId: truckId, // Unique toast ID for each truck
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });

              // Update the last notification time for the truck
              setLastNotificationTime((prevTimes) => ({
                ...prevTimes,
                [truckId]: currentTime,
              }));

              // Store the alarm event in Firestore
              try {
                await addDoc(collection(firestore, "alarms"), {
                  truckId,
                  timestamp: Timestamp.fromDate(new Date(currentTime)),
                  message: `Fuel theft detected for ${truckId}!`,
                });
                console.log("Alarm data added to Firestore");
              } catch (error) {
                console.error("Error adding alarm data to Firestore:", error);
              }
            } else if (entry.isAlarm === false) {
              // Reset the last notification time when the alarm is turned off
              setLastNotificationTime((prevTimes) => ({
                ...prevTimes,
                [truckId]: 0,
              }));
            }
          });
        }
      });

      // Return the unsubscribe function for this specific truck
      return unsubscribeAlarm;
    };

    // Set up listeners for all truck IDs
    const unsubscribeListeners = truckIds.map((truckId) =>
      handleAlarmUpdate(truckId)
    );

    // Cleanup function to remove all listeners when the component unmounts
    return () => {
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe()); // Call each unsubscribe function
      socket.disconnect(); // Clean up WebSocket connection
    };
  }, []); // Run effect only once on mount

  // Listen for alert messages from the server
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL); // Reuse the same socket connection
    socket.on("alert", (message) => {
      console.log("Alert received from server:", message);
      // Show toast notification for server alerts
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    });

    return () => {
      socket.disconnect(); // Clean up WebSocket connection
    };
  }, []); // Run effect only once on mount

  return null; // This component doesn't render anything visible
};

export default AlarmListener;
