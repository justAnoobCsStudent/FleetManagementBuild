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

  // Filter active trucks
  const activeTrucks = trucks.filter((truck) => truck.isActive);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700">Error fetching data: {error.message}</p>
      ) : activeTrucks.length > 0 ? (
        <div className="space-y-4">
          {activeTrucks.map((truck) => (
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
                      className="bg-green-500 h-full rounded-lg"
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
        // Display if there are no active trucks
        <p className="text-gray-600">No active trucks available.</p>
      )}
    </div>
  );
};

export default TruckListCard;
