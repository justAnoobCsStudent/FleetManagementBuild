import React, { useEffect, useState } from "react";
import { query, ref, onValue } from "firebase/database";
import { database, firestore } from "../Firebase";
import {
  collection,
  getDocs,
  where,
  query as firestoreQuery,
  orderBy,
  limit,
} from "firebase/firestore";
import { eventEmitter } from "../utils/eventEmitter";

const AlarmListener = () => {
  const [truckIds, setTruckIds] = useState([]); // Dynamic list of truck IDs
  const [fuelDataCache, setFuelDataCache] = useState({}); // Cache for the last three fuel data entries
  const cooldownSet = new Set(); // Cooldown tracker

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

  const getPreviousEntries = async (truckId, timestamp) => {
    try {
      const fuelDataRef = ref(database, `fuel_data/${truckId}`);
      const snapshot = await new Promise((resolve) =>
        onValue(fuelDataRef, resolve, { onlyOnce: true })
      );
      const data = snapshot.val();

      if (data) {
        const entries = Object.entries(data)
          .filter(
            ([key, entry]) => new Date(entry.timestamp) < new Date(timestamp)
          )
          .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
          .slice(0, 6) // Get the latest 6 entries before the given timestamp
          .map(([key, entry]) => entry);
        return entries;
      }
    } catch (error) {
      console.error(`Error fetching previous entries for ${truckId}:`, error);
      return [];
    }
  };

  const checkVehicleStatus = async (truckId, latestEntries) => {
    try {
      const vehiclesRef = collection(firestore, "vehicles");
      const q = firestoreQuery(vehiclesRef, where("truck_id", "==", truckId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const vehicleData = querySnapshot.docs[0].data();

        if (vehicleData.isIdle) {
          const [first, second, third] = latestEntries;

          // Check if fuel percentage has dropped by 4% or more from the first to the third entry
          if (first.fuel_percentage - third.fuel_percentage >= 4) {
            const isIdlesRef = collection(firestore, "isIdles");
            const idleQuery = firestoreQuery(
              isIdlesRef,
              where("truckName", "==", truckId),
              orderBy("timestamp", "desc"),
              limit(1)
            );
            const idleSnapshot = await getDocs(idleQuery);

            if (
              first.fuel_percentage === second.fuel_percentage ||
              first.fuel_percentage >= second.fuel_percentage ||
              first.fuel_percentage <= second.fuel_percentage
            ) {
              if (!idleSnapshot.empty) {
                const idleDoc = idleSnapshot.docs[0].data();
                const previousEntries = await getPreviousEntries(
                  truckId,
                  idleDoc.timestamp
                );

                if (previousEntries.length === 6) {
                  const allEqual = previousEntries.every(
                    (entry) =>
                      entry.fuel_percentage ===
                      previousEntries[0].fuel_percentage
                  );

                  if (!allEqual) {
                    console.log(
                      `Fuel inconsistency detected for ${truckId}: Previous entries are not all equal.`
                    );

                    if (!cooldownSet.has(truckId)) {
                      // Emit event and start cooldown
                      eventEmitter.emit("fuel:status", {
                        truckId,
                      });
                      console.log(`Emitting fuel:status for ${truckId}.`);

                      cooldownSet.add(truckId); // Add to cooldown
                      setTimeout(() => {
                        cooldownSet.delete(truckId); // Remove after 60 seconds
                      }, 60000); // 60 seconds cooldown
                    } else {
                      console.log(`Cooldown active for ${truckId}, no emit.`);
                    }
                  } else {
                    // All previous entries are equal
                    if (
                      previousEntries[0].fuel_percentage -
                        third.fuel_percentage ==
                      4
                    ) {
                      console.log(`No alarm for ${truckId}: Normal Fuel Drop.`);
                    } else if (
                      previousEntries[0].fuel_percentage -
                        third.fuel_percentage >
                      4
                    ) {
                      console.log(
                        `Fuel inconsistency detected for ${truckId}: Latest entry dropped greater than 4`
                      );

                      if (!cooldownSet.has(truckId)) {
                        // Emit event and start cooldown
                        eventEmitter.emit("fuel:status", {
                          truckId,
                        });
                        console.log(`Emitting fuel:status for ${truckId}.`);

                        cooldownSet.add(truckId); // Add to cooldown
                        setTimeout(() => {
                          cooldownSet.delete(truckId); // Remove after 60 seconds
                        }, 60000); // 60 seconds cooldown
                      } else {
                        console.log(`Cooldown active for ${truckId}, no emit.`);
                      }
                    } else {
                      console.log(
                        `No alarm for ${truckId}: Previous and third fuel percentages are equal (${third.fuel_percentage}%).`
                      );
                    }
                  }
                }
              }
            }
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
