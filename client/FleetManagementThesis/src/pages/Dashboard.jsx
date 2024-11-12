import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import TruckListCard from "@/components/TruckListCard";
import { ref, onValue } from "firebase/database";
import { database } from "../Firebase";

const Dashboard = () => {
  const [markers, setMarkers] = useState([]); // State for GPS markers
  const [fuelData, setFuelData] = useState({}); // State for fuel data
  const [truckIds, setTruckIds] = useState([]); // State for truck IDs

  // Fetch truck GPS data and update markers
  useEffect(() => {
    const markersRef = ref(database, "gps_data");

    const unsubscribeGPS = onValue(markersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dynamicTruckIds = Object.keys(data); // Extract truck IDs from GPS data

        // Update truck IDs only if they have changed
        setTruckIds((prevIds) => {
          if (JSON.stringify(prevIds) !== JSON.stringify(dynamicTruckIds)) {
            return dynamicTruckIds;
          }
          return prevIds;
        });

        // Create marker data for each truck
        const newMarkers = dynamicTruckIds
          .map((truckId) => {
            const latestData = data[truckId];
            const latestKey = Object.keys(latestData).pop();
            const truckData = latestData[latestKey];

            if (truckData.latitude && truckData.longitude) {
              return {
                id: truckId,
                position: [truckData.latitude, truckData.longitude],
                name: `Truck ${truckId}`,
              };
            }
            return null;
          })
          .filter((marker) => marker !== null); // Remove invalid markers

        setMarkers(newMarkers);
      } else {
        console.error("No GPS data found for any trucks");
      }
    });

    return unsubscribeGPS; // Clean-up for GPS listener
  }, []); // Fetch GPS data only on mount

  // Fetch truck fuel data and update fuelData
  useEffect(() => {
    const fuelRef = ref(database, "fuel_data");

    const unsubscribeFuel = onValue(fuelRef, (snapshot) => {
      const data = snapshot.val() || {};
      const newFuelData = {};

      truckIds.forEach((truckId) => {
        if (data[truckId]) {
          const fuelEntries = data[truckId];
          const latestEntry = fuelEntries && Object.keys(fuelEntries).pop();
          newFuelData[truckId] = {
            fuel_percentage: latestEntry
              ? fuelEntries[latestEntry].fuel_percentage || 0
              : 0,
          };
        } else {
          newFuelData[truckId] = { fuel_percentage: 0 };
        }
      });

      setFuelData(newFuelData);
    });

    return unsubscribeFuel; // Clean-up for fuel listener
  }, [truckIds]); // Re-run only when truckIds changes

  return (
    <div className="h-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold mb-4">GPS Tracking</h1>

      {/* Map Section */}
      <div className="h-80 sm:h-96 lg:h-112 rounded-lg overflow-hidden mb-6">
        <Map markers={markers} />
      </div>

      {/* Truck List Section */}
      <div className="w-full pb-4">
        <h2 className="text-xl font-semibold mb-4">Truck List</h2>
        <TruckListCard fuelData={fuelData} />
      </div>
    </div>
  );
};

export default Dashboard;
