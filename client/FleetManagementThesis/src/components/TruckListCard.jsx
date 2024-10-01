import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { database, ref, onValue } from "../Firebase";

const TruckListCard = () => {
  const trucks = [
    { id: "TRUCK01", number: "Truck 001", plate: "ABC 1234" },
    { id: "TRUCK02", number: "Truck 002", plate: "DEF 5678" },
    { id: "TRUCK03", number: "Truck 003", plate: "GHI 9101" },
  ];

  const [fuelData, setFuelData] = useState({});

  // Fetch Fuel Data from Firebase Realtime Database
  useEffect(() => {
    const fuelRef = ref(database, "/fuel_data");

    //Listen for changes in Fuel Data
    const unsubscribe = onValue(fuelRef, (snapshot) => {
      const data = snapshot.val() || {};
      const newFuelData = {};

      // Iteration for each truck
      trucks.forEach((truck) => {
        if (data[truck.id]) {
          // Get the latest fuel entries
          const fuelEntries = data[truck.id];

          // Find the latest entry by getting the most recent key
          if (fuelEntries && Object.keys(fuelEntries).length > 0) {
            const latestEntry = fuelEntries[Object.keys(fuelEntries).pop()];
            newFuelData[truck.id] = {
              // If not available default to 0
              fuel_percentage: latestEntry.fuel_percentage || 0,
            };
          } else {
            // If no entries available
            newFuelData[truck.id] = { fuel_percentage: 0 };
          }
          // If truck ID not found
        } else {
          newFuelData[truck.id] = { fuel_percentage: 0 };
        }
      });
      // Log the fetched data
      console.log("Fuel Data: ", newFuelData);
      // Update the stae of data
      setFuelData(newFuelData);
    });

    // Clean-up function to unsubscribe from database listener
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full">
      <div className="space-y-4">
        {" "}
        {trucks.map((truck) => (
          <div
            key={truck.id}
            className="border-b border-gray-200 pb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-md font-medium">{truck.number}</h3>
              <p className="text-sm text-gray-500">Plate: {truck.plate}</p>

              {/* Fuel Capacity */}
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Fuel Capacity: {fuelData[truck.id]?.fuel_percentage || 0}%
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-lg mt-1">
                  <div
                    className="bg-green-500 h-full rounded-lg"
                    style={{
                      width: `${fuelData[truck.id]?.fuel_percentage || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <Button className={buttonVariants({ variant: "secondary" })}>
              View Truck
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruckListCard;
