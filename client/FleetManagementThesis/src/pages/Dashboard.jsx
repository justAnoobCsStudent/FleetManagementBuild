import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import TruckListCard from "@/components/TruckListCard";
import { ref, onValue } from "firebase/database";
import { database } from "../Firebase";

const Dashboard = () => {
  const [markers, setMarkers] = useState([]); // State for storing GPS markers
  const [fuelData, setFuelData] = useState({}); // State for storing fuel data

  // Fetch GPS data from Firebase Realtime Database
  useEffect(() => {
    const markersRef = ref(database, "gps_data/TRUCK01");
    const fuelRef = ref(database, "fuel_data");

    // Listen for changes in GPS data
    const unsubscribeGPS = onValue(markersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get the latest entry by finding the most recent key
        const latestKey = Object.keys(data).pop();
        const latestData = data[latestKey];
        if (latestData.latitude && latestData.longitude) {
          // Log the fetched latitude and longitude data
          console.log("Fetched GPS Data:", latestData);
          // Create marker data for the map
          const markerData = {
            id: "TRUCK01", // Unique ID for the marker
            position: [latestData.latitude, latestData.longitude], // Latitude and longitude from Firebase
            name: "Truck 01", // Name for the marker
          };
          // Update markers state
          setMarkers([markerData]);
          console.log("Markers set:", [markerData]); // Log the markers set
        } else {
          console.error("Invalid GPS data:", latestData); // Log if data is invalid
        }
      } else {
        console.error("No GPS data found for TRUCK01");
      }
    });

    // Listen for changes in fuel data
    const unsubscribeFuel = onValue(fuelRef, (snapshot) => {
      console.log("Fetched fuel data:", snapshot.val());
      const data = snapshot.val() || {};
      const newFuelData = {};

      const trucks = ["TRUCK01", "TRUCK02", "TRUCK03"];
      trucks.forEach((truck) => {
        if (data[truck]) {
          // Get the latest entry by finding the most recent key
          const fuelEntries = data[truck];
          const latestEntry = fuelEntries && Object.keys(fuelEntries).pop();
          newFuelData[truck] = {
            fuel_percentage: latestEntry
              ? fuelEntries[latestEntry].fuel_percentage || 0
              : 0,
          };
        } else {
          newFuelData[truck] = { fuel_percentage: 0 }; // Default value if no data
        }
      });
      // Update Fuel state
      setFuelData(newFuelData);
    });

    // Clean-up function to unsubscribe from database listener
    return () => {
      unsubscribeGPS();
      unsubscribeFuel();
    };
  }, []);

  // Return Dashboard
  return (
    <div className="h-full mb-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold mb-4">GPS Tracking</h1>

      {/* Map Section with responsive height */}
      <div className="h-80 sm:h-96 lg:h-112 rounded-lg overflow-hidden mb-6">
        <Map markers={markers} />
      </div>

      {/* Truck List Section */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">Truck List</h2>
        <TruckListCard fuelData={fuelData} /> {/* Pass fuelData directly */}
      </div>
    </div>
  );
};

export default Dashboard;
