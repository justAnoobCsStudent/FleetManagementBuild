import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { database, firestore } from "../Firebase";
import checkGeofenceStatus from "../utils/checkGeofenceStatus";

const GeoFenceListener = () => {
  const [truckIds, setTruckIds] = useState([]); // State for dynamic truck IDs

  const updateIdleStatus = async (truckId, isIdle) => {
    try {
      const vehiclesRef = collection(firestore, "vehicles");
      const q = query(vehiclesRef, where("truck_id", "==", truckId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const vehicleDoc = querySnapshot.docs[0];
        const vehicleDocId = vehicleDoc.id;

        // Update the isIdle status
        await updateDoc(doc(firestore, "vehicles", vehicleDocId), { isIdle });
        console.log(`Updated isIdle status for ${truckId}: ${isIdle}`);
      } else {
        console.warn(
          `Vehicle with truck_id ${truckId} not found in Firestore.`
        );
      }
    } catch (error) {
      console.error(`Error updating isIdle status for ${truckId}:`, error);
    }
  };

  useEffect(() => {
    const markersRef = ref(database, "gps_data");

    // Listener for fetching all truck GPS data
    const unsubscribeGPS = onValue(markersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dynamicTruckIds = Object.keys(data); // Extract truck IDs from GPS data

        // Update truck IDs dynamically
        setTruckIds((prevIds) => {
          if (JSON.stringify(prevIds) !== JSON.stringify(dynamicTruckIds)) {
            return dynamicTruckIds;
          }
          return prevIds;
        });

        // Iterate over each truck and set up individual listeners
        dynamicTruckIds.forEach((truckId) => {
          const truckRef = ref(database, `gps_data/${truckId}`);
          onValue(truckRef, (truckSnapshot) => {
            const truckData = truckSnapshot.val();
            if (truckData) {
              const entries = Object.entries(truckData).sort(
                ([keyA], [keyB]) => keyB.localeCompare(keyA) // Sort by keys to get the latest first
              );
              if (entries.length >= 2) {
                const [, latestEntry] = entries[0];
                const [, previousEntry] = entries[1];

                // Compare the latest and previous positions
                const isIdle =
                  latestEntry.latitude === previousEntry.latitude &&
                  latestEntry.longitude === previousEntry.longitude;

                // Update the isIdle status in Firestore
                updateIdleStatus(truckId, isIdle);

                // Check geofence status for the current truck position
                const position = [latestEntry.latitude, latestEntry.longitude];
                checkGeofenceStatus(position, truckId);
              }
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

  return null; // No UI, purely functional
};

export default GeoFenceListener;
