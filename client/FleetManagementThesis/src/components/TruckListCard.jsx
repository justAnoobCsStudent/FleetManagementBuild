import React from "react";
import { Button } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const TruckListCard = ({ fuelData = {} }) => {
  const {
    data: trucks = [], // Trucks data
    isLoading, // Loading state
    error, // Error state
  } = useFetch("/vehicles");

  console.log("Fuel Data in TruckListCard:", fuelData);

  // Function to determine fuel bar color based on percentage
  const getFuelBarColor = (fuelPercentage) => {
    if (fuelPercentage < 33) return "bg-red-500"; // Low fuel level
    if (fuelPercentage < 66) return "bg-yellow-500"; // Medium fuel level
    return "bg-green-500"; // High fuel level
  };

  // Sort trucks by truck_id in ascending order (e.g., TRUCK01, TRUCK02, TRUCK03)
  const sortedTrucks = [...trucks].sort((a, b) =>
    a.truck_id.localeCompare(b.truck_id)
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700">Error fetching data: {error.message}</p>
      ) : sortedTrucks.length > 0 ? (
        <div className="space-y-4">
          {sortedTrucks.map((truck) => (
            <div
              key={truck.truck_id}
              className="border-b border-gray-200 pb-4 flex justify-between items-center"
            >
              {/* Truck information */}
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {truck.truck_id}
                </h3>
                <p className="text-md font-medium mb-2">
                  Plate Number: {truck.plateNumber}
                </p>
                <p className="text-md font-medium mb-2">
                  Active Driver:
                  {truck.driver?.name
                    ? ` ${truck.driver.name.lastName}, ${truck.driver.name.firstName}`
                    : ` No Driver Assigned`}
                </p>

                {/* Fuel Capacity */}
                <div className="mt-2">
                  <p className="text-md font-medium text-gray-600 mb-2">
                    Fuel Capacity:
                    {fuelData[truck.truck_id]?.fuel_percentage || 0}%
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-lg mt-1">
                    <div
                      className={`h-full rounded-lg ${getFuelBarColor(
                        fuelData[truck.truck_id]?.fuel_percentage || 0
                      )}`}
                      style={{
                        width: `${
                          fuelData[truck.truck_id]?.fuel_percentage || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <Link to={`/view-truck/${truck.id}`}>
                <Button className="bg-gray-500 hover:bg-gray-600 text-white">
                  View Truck
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        // Display if there are no trucks
        <p className="text-gray-600">No trucks available.</p>
      )}
    </div>
  );
};

export default TruckListCard;
