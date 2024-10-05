import React from "react";
import { Button, buttonVariants } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import Spinner from "./Spinner";

const TruckListCard = ({ fuelData = {} }) => {
  // Using custom hook (useFetch) to fetch the data from database
  const { data: trucks = [], isLoading, error } = useFetch("/vehicles");

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full">
      {isLoading ? ( // Loader for data fetching
        <Spinner loading={isLoading} />
      ) : error ? ( // Dispay error messages in fetching data
        <p className="text-red-700">Error fetching data: {error.message}</p>
      ) : trucks.length > 0 ? ( // Displaying if there is active truck/s
        <div className="space-y-4">
          {trucks
            .filter((truck) => truck.isActive) // Filtering the active trucks
            .map((truck) => (
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
                    Active Driver: {truck.driver.firstName}
                  </p>

                  {/* Fuel Capacity */}
                  <div className="mt-2">
                    <p className="text-md font-medium text-gray-600 mb-2">
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
                <Button className={buttonVariants({ variant: "primary" })}>
                  View Truck
                </Button>
              </div>
            ))}
        </div>
      ) : (
        // Display if there is no active trucks
        <p className="text-gray-600">No active trucks available.</p>
      )}
    </div>
  );
};

export default TruckListCard;
