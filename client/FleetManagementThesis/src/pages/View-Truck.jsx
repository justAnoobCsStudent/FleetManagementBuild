import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Map from "@/components/Map";
import { ref, onValue } from "firebase/database";
import { database } from "../Firebase";

const ViewTruck = () => {
  const { id } = useParams(); // Get truck ID from the URL
  const [truck, setTruck] = useState(null); // Truck data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [markers, setMarkers] = useState([]); // State for storing GPS markers

  // Fetch truck data from API or server
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/vehicles/${id}`
        ); // API endpoint
        setTruck(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching truck data.");
        setLoading(false);
      }
    };

    fetchTruck();

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
  }, [id]);

  if (loading) {
    return <div>Loading truck details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Truck Details</h1>
      <h1 className="text-xl font-semibold">GPS Tracking</h1>

      {/* Map Section with responsive height */}
      <div className="h-80 sm:h-96 lg:h-112 rounded-lg overflow-hidden mb-6">
        <Map markers={markers} />
      </div>
      <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center"></div>
        <div>
          <p>
            <strong>Truck ID:</strong> {truck.truck_id}
          </p>
          <p>
            <strong>Unit:</strong> {truck.unit}
          </p>
          <p>
            <strong>Driver:</strong>{" "}
            {truck.driver.name
              ? `${truck.driver.name.lastName}, ${truck.driver.name.firstName}`
              : `No Driver Assigned`}
          </p>
          <p>
            <strong>Plate Number:</strong> {truck.plateNumber}
          </p>
          <p>
            <strong>Color:</strong> {truck.color}
          </p>
          <p>
            <strong>Transmission:</strong> {truck.transmission}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTruck;
