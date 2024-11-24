import React, { useEffect, useState } from "react";
import { query, ref, onValue } from "firebase/database";
import { database, firestore } from "../Firebase";
import {
  collection,
  getDocs,
  where,
  query as firestoreQuery,
} from "firebase/firestore";
import { eventEmitter } from "../utils/eventEmitter"; // Assuming you have an event emitter utility

const AlarmListener = () => {
  const [truckIds, setTruckIds] = useState([]); // Dynamic list of truck IDs
  const [fuelDataCache, setFuelDataCache] = useState({}); // Cache for the last three fuel data entries

  useEffect(() => {
    const fuelRef = ref(database, "fuel_data");

    // Listener for fetching all fuel data
    const unsubscribeFuel = onValue(fuelRef, (snapshot) => {
      const data = snapshot.val() || {};
      const dynamicTruckIds = Object.keys(data); // Extract truck IDs from fuel data

      setTruckIds((prevIds) => {
        if (JSON.stringify(prevIds) !== JSON.stringify(dynamicTruckIds)) {
          return dynamicTruckIds;
        }
        return prevIds;
      });

      dynamicTruckIds.forEach((truckId) => {
        const fuelEntries = data[truckId];
        if (fuelEntries) {
          const entryKeys = Object.keys(fuelEntries).sort(); // Ensure chronological order
          const latestEntries = entryKeys
            .slice(-3) // Get the last three entries
            .map((key) => ({ ...fuelEntries[key], key })); // Include key for reference

          // Update the cache with the latest three entries for this truck
          setFuelDataCache((prevCache) => ({
            ...prevCache,
            [truckId]: latestEntries,
          }));

          // Check vehicle status in Firestore
          if (latestEntries.length === 3) {
            checkVehicleStatus(truckId, latestEntries);
          }
        }
      });
    });

    return () => unsubscribeFuel(); // Cleanup listener
  }, []);

  const checkVehicleStatus = async (truckId, latestEntries) => {
    try {
      const vehiclesRef = collection(firestore, "vehicles");
      const q = firestoreQuery(vehiclesRef, where("truck_id", "==", truckId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const vehicleData = querySnapshot.docs[0].data();

        if (vehicleData.isActive && vehicleData.isIdle) {
          const [first, second, third] = latestEntries;

          // Check if fuel percentage has dropped by 4% or more from the first to the third entry
          if (
            first.fuel_percentage !== undefined &&
            third.fuel_percentage !== undefined &&
            first.fuel_percentage === second.fuel_percentage &&
            first.fuel_percentage - third.fuel_percentage >= 4
          ) {
            console.log(
              `Fuel drop detected for ${truckId}: First - ${first.fuel_percentage}%, Second - ${second.fuel_percentage}%, Third - ${third.fuel_percentage}%`
            );

            // Emit event
            eventEmitter.emit("fuel:status", {
              truckId,
              message: `Fuel drop detected for ${truckId}.`,
              firstFuel: first.fuel_percentage,
              secondFuel: second.fuel_percentage,
              thirdFuel: third.fuel_percentage,
            });
          }
        }
      } else {
        console.warn(`Truck ${truckId} not found in vehicles collection.`);
      }
    } catch (error) {
      console.error(`Error checking vehicle status for ${truckId}:`, error);
    }
  };

  return null; // This component doesn't render anything visible
};

export default AlarmListener;
