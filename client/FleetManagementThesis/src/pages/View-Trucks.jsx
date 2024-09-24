import React, { useState, useEffect } from "react";

const ViewTrucks = () => {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    //Fetch data from server
  }, []);

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Trucks</h2>
      {trucks.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Brand</th>
              <th className="py-2 px-4 border-b">Unit</th>
              <th className="py-2 px-4 border-b">Plate Number</th>
              <th className="py-2 px-4 border-b">Year Purchased</th>
              <th className="py-2 px-4 border-b">Color</th>
              <th className="py-2 px-4 border-b">Transmission</th>
              <th className="py-2 px-4 border-b">Odometer</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{truck.brand}</td>
                <td className="py-2 px-4 border-b">{truck.unit}</td>
                <td className="py-2 px-4 border-b">{truck.plateNumber}</td>
                <td className="py-2 px-4 border-b">{truck.yearPurchased}</td>
                <td className="py-2 px-4 border-b">{truck.color}</td>
                <td className="py-2 px-4 border-b">{truck.transmission}</td>
                <td className="py-2 px-4 border-b">{truck.odometer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No trucks available.</p>
      )}
    </div>
  );
};

export default ViewTrucks;
