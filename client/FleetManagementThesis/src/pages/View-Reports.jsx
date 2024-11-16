import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { firestore, database } from "../Firebase";
import { Button, buttonVariants } from "../components/ui/button";

const ViewReports = () => {
  const trucks = [
    { id: "TRUCK01", plate: "ABC 1234", driver: "John Doe" },
    { id: "TRUCK02", plate: "DEF 5678", driver: "Jane Smith" },
    { id: "TRUCK03", plate: "GHI 9101", driver: "Alice Johnson" },
  ];
  const truckIds = trucks.map((truck) => truck.id);

  const [fuelTheftCount, setFuelTheftCount] = useState(0); // Count for Fuel Theft alarms
  const [geofenceCount, setGeofenceCount] = useState(0); // Count for Geofence alarms
  const [fuelData, setFuelData] = useState({}); // Fuel data for each truck

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfDay = today;
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const alarmsRef = collection(firestore, "alarms");

        // Fetch Fuel Theft alarms
        const fuelTheftQuery = query(
          alarmsRef,
          where("timestamp", ">=", startOfDay),
          where("timestamp", "<=", endOfDay),
          where("type", "==", "Fuel Theft")
        );
        const fuelTheftSnapshot = await getDocs(fuelTheftQuery);
        setFuelTheftCount(fuelTheftSnapshot.size);

        // Fetch Geofence alarms
        const geofenceQuery = query(
          alarmsRef,
          where("timestamp", ">=", startOfDay),
          where("timestamp", "<=", endOfDay),
          where("type", "==", "Geofence")
        );
        const geofenceSnapshot = await getDocs(geofenceQuery);
        setGeofenceCount(geofenceSnapshot.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
          const currentFuel = latestEntry
            ? fuelEntries[latestEntry].fuel_percentage || 0
            : 0;

          newFuelData[truckId] = {
            fuel_used: 100 - currentFuel, // Calculate fuel used as the inverse of current fuel
          };
        } else {
          newFuelData[truckId] = { fuel_used: 100 }; // If no data, assume full usage
        }
      });

      setFuelData(newFuelData);
    });

    return unsubscribeFuel; // Clean-up for fuel listener
  }, [truckIds]); // Re-run only when truckIds changes

  // Format today's date
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Determine the color based on the fuel used percentage
  const getFuelBarColor = (fuelUsed) => {
    if (fuelUsed < 33) return "bg-green-500"; // Low fuel used
    if (fuelUsed < 66) return "bg-yellow-500"; // Medium fuel used
    return "bg-red-500"; // High fuel used
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">
        Daily Report for {formattedDate}
      </h1>

      <div className="bg-gray-100 p-6 mb-6 w-full border-b border-gray-400">
        <div className="grid grid-cols-1 gap-6">
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-white p-4 rounded-lg shadow w-full flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold mb-4">
                Fuel Used - {truck.id}
              </h3>
              <div className="w-full bg-gray-300 rounded-full h-8 overflow-hidden relative">
                <div
                  className={`${getFuelBarColor(
                    fuelData[truck.id]?.fuel_used || 0
                  )} h-full`}
                  style={{
                    width: `${fuelData[truck.id]?.fuel_used || 0}%`,
                  }}
                ></div>
                <p className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                  {fuelData[truck.id]?.fuel_used || 0}%
                </p>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">Fuel Theft Alarms</h3>
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-red-100">
                <p className="text-3xl font-bold text-red-600">
                  {fuelTheftCount}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">Geofence Alarms</h3>
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100">
                <p className="text-3xl font-bold text-blue-600">
                  {geofenceCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
