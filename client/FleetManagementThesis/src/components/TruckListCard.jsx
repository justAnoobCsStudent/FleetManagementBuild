import React from "react";
import { Button, buttonVariants } from "./ui/button";

const TruckListCard = () => {
  const trucks = [
    { id: 1, number: "Truck 001", plate: "ABC 1234", fuel: 75 },
    { id: 2, number: "Truck 002", plate: "DEF 5678", fuel: 50 },
    { id: 3, number: "Truck 003", plate: "GHI 9101", fuel: 90 },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full">
      <div className="space-y-4">
        {" "}
        {/* Adds vertical spacing between each truck */}
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
                  Fuel Capacity: {truck.fuel}%
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-lg mt-1">
                  <div
                    className="bg-green-500 h-full rounded-lg"
                    style={{ width: `${truck.fuel}%` }}
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
