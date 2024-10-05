import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, buttonVariants } from "../components/ui/button";
import useFetch from "@/hooks/useFetch";

const ViewReports = () => {
  const trucks = [
    {
      id: "TRUCK01",
      plate: "ABC 1234",
      driver: "John Doe",
    },
    {
      id: "TRUCK02",
      plate: "DEF 5678",
      driver: "Jane Smith",
    },
    {
      id: "TRUCK03",
      plate: "GHI 9101",
      driver: "Alice Johnson",
    },
  ];

  const [dateTime, setDateTime] = useState(new Date());
  const { data: reports, isLoading, error } = useFetch("/reports");

  // Example data
  const averageFuelUsed = "50 L";
  const averageDistanceTravelled = "300 km";
  const alarmTriggered = "2 times";
  const efficiency = "75%";

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Reports</h2>
      <div className="bg-gray-100 p-6 mb-6 w-full border-b border-gray-400">
        <h1 className="text-2xl font-semibold mb-4">
          Average Report for{" "}
          {dateTime.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Average Fuel Used:</h3>
            <p className="text-lg">{averageFuelUsed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">
              Average Distance Travelled:
            </h3>
            <p className="text-lg">{averageDistanceTravelled}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Alarm Triggered:</h3>
            <p className="text-lg">{alarmTriggered}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Efficiency:</h3>
            <p className="text-lg">{efficiency}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 mb-6 w-full">
        {trucks.map((truck) => (
          <div key={truck.id} className="grid grid-cols-1 mb-5">
            <div className="bg-white p-4 rounded-lg shadow w-full flex justify-between items-center">
              <div>
                <p className="text-l font-semibold mb-2">
                  Truck Id: {truck.id}
                </p>
                <p className="text-l font-semibold mb-2">
                  Plate Number: {truck.plate}
                </p>
                <p className="text-l font-semibold mb-2">
                  Driver: {truck.driver}
                </p>
              </div>
              <Button className={buttonVariants({ variant: "primary" })}>
                View Truck
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReports;
