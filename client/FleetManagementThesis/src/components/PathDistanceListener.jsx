import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database, firestore } from "../Firebase"; // Import Firestore
import { collection, query, where, getDocs } from "firebase/firestore";
import calculateDistance from "../utils/pathDistance";
import { eventEmitter } from "../utils/eventEmitter"; // Import EventEmitter

const PathDistanceListener = () => {
  const [lastEmittedDistances, setLastEmittedDistances] = useState({}); // Keep track of last emitted distances

  // Helper function to check if a truck is active
  const checkIfTruckIsActive = async (truckId) => {
    try {
      const vehiclesRef = collection(firestore, "vehicles");
      const q = query(vehiclesRef, where("truck_id", "==", truckId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const vehicleData = querySnapshot.docs[0].data();
        return vehicleData.isActive; // Return the isActive status
      } else {
        console.warn(`Truck ${truckId} not found in vehicles collection.`);
        return false;
      }
    } catch (error) {
      console.error(`Error fetching isActive status for ${truckId}:`, error);
      return false;
    }
  };

  useEffect(() => {
    const truckIds = ["TRUCK01", "TRUCK02", "TRUCK03"];
    const markersRef = ref(database, "gps_data");

    // Listener for fetching all truck GPS data
    const unsubscribeGPS = onValue(markersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Iterate over each truck and calculate distances
        truckIds.forEach((truckId) => {
          const truckRef = ref(database, `gps_data/${truckId}`);
          onValue(truckRef, (truckSnapshot) => {
            const truckData = truckSnapshot.val();
            if (truckData) {
              const entries = Object.entries(truckData)
                .sort(([keyA], [keyB]) => keyB.localeCompare(keyA)) // Sort by key descending (latest first)
                .slice(0, 2); // Get the first two latest entries

              const positions = entries.map(([_, entry]) => ({
                latitude: entry.latitude,
                longitude: entry.longitude,
              }));

              // Calculate total distance for the truck
              let totalDistance = 0;
              if (positions.length === 2) {
                const { latitude: lat1, longitude: lon1 } = positions[0];
                const { latitude: lat2, longitude: lon2 } = positions[1];
                totalDistance = calculateDistance(lat1, lon1, lat2, lon2);
              }

              // Update the truck's distance if it has changed
              setLastEmittedDistances((prevEmitted) => ({
                ...prevEmitted,
                [truckId]: totalDistance,
              }));
            }
          });
        });
      } else {
        console.error("No GPS data found for any trucks");
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeGPS(); // Clean up the GPS listener
    };
  }, []);

  useEffect(() => {
    // Set up a 30-second interval to emit distances
    const interval = setInterval(() => {
      Object.entries(lastEmittedDistances).forEach(
        async ([truckId, distance]) => {
          const isActive = await checkIfTruckIsActive(truckId);
          if (isActive) {
            eventEmitter.emit("distance:status", { truckId, distance });
          }
        }
      );
    }, 30000); // 30 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [lastEmittedDistances]);

  return null; // No UI, purely functional
};

export default PathDistanceListener;
