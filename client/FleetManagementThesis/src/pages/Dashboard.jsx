import React from "react";
import Map from "../components/Map"; // Import the Map component
import TruckListCard from "@/components/TruckListCard";

const Dashboard = () => {
  const markers = [
    {
      id: 1,
      position: [14.31860301338563, 120.86070267301378],
      name: "Daniellah's Junkshop",
    },
    {
      id: 2,
      position: [14.416267169719413, 120.88057415088718],
      name: "Cavite Economic Zone II",
    },
    {
      id: 3,
      position: [14.402041420483462, 120.87321416940911],
      name: "Cavite Economic Zone IV",
    },
  ];

  return (
    <div className="h-full mb-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold mb-4">GPS Tracking</h1>

      {/* Map Section with responsive height */}
      <div className="h-80 sm:h-96 lg:h-112 rounded-lg overflow-hidden mb-6">
        <Map markers={markers} />
      </div>

      {/* Truck List Section */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">Truck List</h2>
        <TruckListCard />
      </div>
    </div>
  );
};

export default Dashboard;
