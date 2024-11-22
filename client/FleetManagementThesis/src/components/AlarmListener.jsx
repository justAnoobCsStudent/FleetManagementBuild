import React, { useEffect, useState } from "react";
import { query, limitToLast, ref, onValue } from "firebase/database";
import { database, firestore } from "../Firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  where,
  query as firestoreQuery,
} from "firebase/firestore";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:7000"; // Your WebSocket backend URL
const COOLDOWN_PERIOD = 10000; // 10 seconds in milliseconds

const AlarmListener = () => {
  const [lastProcessedTime, setLastProcessedTime] = useState({}); // Track the last processed time for each truck

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL); // Establish WebSocket connection

    const truckIds = ["TRUCK01", "TRUCK02", "TRUCK03"]; // List of truck IDs, replace with your actual IDs

    const handleAlarmUpdate = (truckId) => {
      // Create a query to get only the latest data for the truck
      const fuelDataRef = query(
        ref(database, `fuel_data/${truckId}`),
        limitToLast(1) // Retrieve only the latest entry
      );

      const unsubscribeAlarm = onValue(fuelDataRef, async (snapshot) => {
        const fuelData = snapshot.val();

        if (fuelData) {
          // Since we use `limitToLast(1)`, the data will only have one entry
          Object.entries(fuelData).forEach(async ([key, entry]) => {
            const currentTime = Date.now();
            const uniqueEntryId = `${truckId}-${key}`; // Create a unique identifier for each entry
            const lastTime = lastProcessedTime[truckId]?.[key] || 0;

            // Check if the alarm property `isAlarm` is true and it's not within the cooldown period
            if (
              entry.isAlarm === true &&
              (!lastProcessedTime[truckId]?.[key] ||
                currentTime - lastTime > COOLDOWN_PERIOD)
            ) {
              console.log(`Alarm triggered for ${truckId}, entry ${key}!`);

              // Query Firestore to check if the document is already written
              const alarmsQuery = firestoreQuery(
                collection(firestore, "alarms"),
                where("truckId", "==", truckId),
                where("entryId", "==", key) // Use `key` as the entry identifier
              );
              const querySnapshot = await getDocs(alarmsQuery);

              if (querySnapshot.empty) {
                // If the document does not exist in the alarms collection, write it
                try {
                  const docRef = await addDoc(collection(firestore, "alarms"), {
                    truckname: truckId,
                    entryId: key, // Include entry ID for uniqueness
                    timestamp: Timestamp.fromDate(new Date(currentTime)),
                    message: `Fuel abnormalities detected in ${truckId}!`,
                    type: `Fuel Theft`,
                    isRead: false, // New isRead property
                  });
                  console.log(
                    `Alarm data added to Firestore with ID: ${docRef.id}`
                  );

                  // Update the last processed time for this specific entry
                  setLastProcessedTime((prevTimes) => ({
                    ...prevTimes,
                    [truckId]: { ...prevTimes[truckId], [key]: currentTime },
                  }));
                } catch (error) {
                  console.error("Error adding alarm data to Firestore:", error);
                }
              } else {
                console.log(
                  `Alarm for ${truckId}, entry ${key} already exists.`
                );
              }
            }
          });
        }
      });

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
  }, [lastProcessedTime]); // Dependencies to track state changes

  return null; // This component doesn't render anything visible
};

export default AlarmListener;
