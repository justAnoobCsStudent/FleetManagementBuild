import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Map from "@/components/Map";
import { ref, onValue } from "firebase/database";
import { database } from "../Firebase";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Spinner from "@/components/Spinner";

const ViewTruck = () => {
  const { id } = useParams(); // Get truck ID from the URL
  const [truck, setTruck] = useState(null); // Truck data state
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [markers, setMarkers] = useState([]); // State for storing GPS markers
  const [fuelData, setFuelData] = useState({}); // State for fuel data

  // Fetch truck data from API or server
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/vehicles/${id}`
        ); // API endpoint
        setTruck(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError("Error fetching truck data.");
        setIsLoading(false);
      }
    };

    fetchTruck();

    const markersRef = ref(database, "gps_data/TRUCK01");
    const fuelRef = ref(database, "fuel_data");

    // Listen for changes in GPS data
    const unsubscribeGPS = onValue(markersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestKey = Object.keys(data).pop();
        const latestData = data[latestKey];
        if (latestData.latitude && latestData.longitude) {
          const markerData = {
            id: "TRUCK01",
            position: [latestData.latitude, latestData.longitude],
            name: "Truck 01",
          };
          setMarkers([markerData]);
        }
      }
    });

    // Listen for changes in fuel data
    const unsubscribeFuel = onValue(fuelRef, (snapshot) => {
      const data = snapshot.val() || {};
      const newFuelData = {};

      const trucks = ["TRUCK01", "TRUCK02", "TRUCK03"];
      trucks.forEach((truck) => {
        if (data[truck]) {
          const fuelEntries = data[truck];
          const latestEntry = fuelEntries && Object.keys(fuelEntries).pop();
          newFuelData[truck] = {
            fuel_percentage: latestEntry
              ? fuelEntries[latestEntry].fuel_percentage || 0
              : 0,
          };
        } else {
          newFuelData[truck] = { fuel_percentage: 0 };
        }
      });
      setFuelData(newFuelData);
    });

    return () => {
      unsubscribeGPS();
      unsubscribeFuel();
    };
  }, [id]);

  if (isLoading) {
    return <Spinner loading={isLoading} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Truck Details</h1>
      <h2 className="text-xl font-semibold mb-4">GPS Tracking</h2>

      {/* Map Section with responsive height */}
      <div className="h-80 sm:h-96 lg:h-112 rounded-lg overflow-hidden mb-6">
        <Map markers={markers} />
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <h3 className="text-lg font-semibold">Truck Information</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Truck ID:</strong> {truck.truck_id}
            </p>
            <p>
              <strong>Unit:</strong> {truck.unit}
            </p>
            <p>
              <strong>Driver:</strong>
              {truck.driver.name
                ? `${truck.driver.name.lastName}, ${truck.driver.name.firstName}`
                : "No Driver Assigned"}
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
            <p>
              <strong>Fuel Percentage:</strong>{" "}
              {fuelData["TRUCK01"]?.fuel_percentage || 0}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewTruck;
