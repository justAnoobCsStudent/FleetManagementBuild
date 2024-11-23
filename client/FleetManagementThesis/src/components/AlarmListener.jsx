import React, { useEffect, useState } from "react";
import { query, limitToLast, ref, onValue } from "firebase/database";
import { database, firestore } from "../Firebase";
import {
  collection,
  getDocs,
  where,
  query as firestoreQuery,
} from "firebase/firestore";
import { eventEmitter } from "../utils/eventEmitter";

const AlarmListener = () => {
  const [lastProcessedTime, setLastProcessedTime] = useState({}); // Track the last processed time for each truck

  useEffect(() => {
    const truckIds = ["TRUCK01", "TRUCK02", "TRUCK03"]; // List of truck IDs, replace with your actual IDs

    const handleFuelCheck = (truckId) => {
      // Create a query to get only the latest data for the truck
      const fuelDataRef = query(
        ref(database, `fuel_data/${truckId}`),
        limitToLast(1) // Retrieve only the latest entry
      );

      const unsubscribeFuel = onValue(fuelDataRef, async (snapshot) => {
        const fuelData = snapshot.val();

        if (fuelData) {
          // Since we use `limitToLast(1)`, the data will only have one entry
          Object.entries(fuelData).forEach(async ([key, entry]) => {
            const uniqueEntryId = `${truckId}-${key}`; // Create a unique identifier for each entry

            // Query Firestore to check the truck's `isActive` and `isIdle` status
            const vehiclesQuery = firestoreQuery(
              collection(firestore, "vehicles"),
              where("truck_id", "==", truckId)
            );
            const querySnapshot = await getDocs(vehiclesQuery);

            if (!querySnapshot.empty) {
              const vehicleData = querySnapshot.docs[0].data();

              if (vehicleData.isActive && vehicleData.isIdle) {
                // Start a 30-second timer to monitor fuel percentage
                setTimeout(() => {
                  if (entry.fuel_percentage <= 4) {
                    console.log(
                      `Fuel dropped below 4% for ${truckId}. Emitting fuel:status event.`
                    );

                    // Emit fuel status event
                    eventEmitter.emit("fuel:status", {
                      truckId,
                      fuel_percentage: entry.fuel_percentage,
                      message: `Fuel abnormality detected in ${truckId}!`,
                    });

                    // Update the last processed time for this specific entry
                    setLastProcessedTime((prevTimes) => ({
                      ...prevTimes,
                      [truckId]: { ...prevTimes[truckId], [key]: Date.now() },
                    }));
                  }
                }, 30000);
              }
            } else {
              console.warn(
                `Vehicle data for truck ID ${truckId} not found in Firestore.`
              );
            }
          });
        }
      });

      return unsubscribeFuel;
    };

    // Set up listeners for all truck IDs
    const unsubscribeListeners = truckIds.map((truckId) =>
      handleFuelCheck(truckId)
    );

    // Cleanup function to remove all listeners when the component unmounts
    return () => {
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe()); // Call each unsubscribe function
    };
  }, [lastProcessedTime]); // Dependencies to track state changes

  return null; // This component doesn't render anything visible
};

export default AlarmListener;
