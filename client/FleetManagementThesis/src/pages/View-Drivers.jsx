import React, { useState, useEffect } from "react";

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    //Fetch data from server
  }, []);

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Drivers</h2>
      {drivers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Middle Initial</th>
              <th className="py-2 px-4 border-b">License Number</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Gender</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{driver.firstName}</td>
                <td className="py-2 px-4 border-b">{driver.lastName}</td>
                <td className="py-2 px-4 border-b">{driver.middleInitial}</td>
                <td className="py-2 px-4 border-b">{driver.licenseNumber}</td>
                <td className="py-2 px-4 border-b">{driver.age}</td>
                <td className="py-2 px-4 border-b">{driver.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{driver.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No drivers available.</p>
      )}
    </div>
  );
};

export default ViewDrivers;
