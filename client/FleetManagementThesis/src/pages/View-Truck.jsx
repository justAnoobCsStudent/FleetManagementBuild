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
  const [fuelPercentage, setFuelPercentage] = useState(0); // State for fuel data
  const [mapCenter, setMapCenter] = useState([0, 0]); // State for map center

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/vehicles/${id}`
        ); // Fetch truck details
        const fetchedTruck = response.data.data;
        setTruck(fetchedTruck);
        setIsLoading(false);

        // Set up Firebase references based on truck_id
        const truckRef = ref(database, `gps_data/${fetchedTruck.truck_id}`);
        const fuelRef = ref(database, `fuel_data/${fetchedTruck.truck_id}`);

        // Listen for changes in GPS data
        const unsubscribeGPS = onValue(truckRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const latestKey = Object.keys(data).pop();
            const latestData = data[latestKey];
            if (latestData.latitude && latestData.longitude) {
              const markerData = {
                id: fetchedTruck.truck_id,
                position: [latestData.latitude, latestData.longitude],
                name: `Truck ${fetchedTruck.truck_id}`,
              };
              setMarkers([markerData]);
              setMapCenter([latestData.latitude, latestData.longitude]); // Update map center
            }
          }
        });

        // Listen for changes in fuel data
        const unsubscribeFuel = onValue(fuelRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const latestKey = Object.keys(data).pop();
            const latestData = data[latestKey];
            setFuelPercentage(latestData?.fuel_percentage || 0);
          }
        });

        // Cleanup function to unsubscribe from Firebase listeners
        return () => {
          unsubscribeGPS(); // Unsubscribe from GPS data listener
          unsubscribeFuel(); // Unsubscribe from fuel data listener
        };
      } catch (error) {
        setError("Error fetching truck data.");
        setIsLoading(false);
      }
    };

    fetchTruck();
  }, [id]);

  // Determine the fuel bar color based on fuel percentage
  const getFuelBarColor = () => {
    if (fuelPercentage < 33) return "bg-red-500"; // Low fuel
    if (fuelPercentage < 66) return "bg-yellow-500"; // Medium fuel
    return "bg-green-500"; // High fuel
  };

  if (isLoading) {
    return <Spinner loading={isLoading} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold mb-4">Truck Details</h1>
      <h2 className="text-xl font-semibold mb-4">GPS Tracking</h2>

      {/* Map Section with responsive height */}
      <div className="h-80 sm:h-96 lg:h-112 rounded-lg overflow-hidden mb-6">
        <Map
          markers={markers}
          center={mapCenter} // Center the map on the truck's position
          zoom={18} // Maximum zoom level
        />
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <h3 className="text-lg font-semibold">Truck Information</h3>
          <hr className="w-auto" />
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
              <strong>Driver:</strong>{" "}
              {truck.driver?.name
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
            {/* Fuel Capacity */}
            <div className="mt-2">
              <p className="text-md font-medium text-gray-600 mb-2">
                Fuel Capacity: {fuelPercentage}%
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-lg mt-1">
                <div
                  className={`h-full rounded-lg ${getFuelBarColor()}`}
                  style={{
                    width: `${fuelPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewTruck;
