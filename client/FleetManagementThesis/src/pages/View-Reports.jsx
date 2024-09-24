import React, { useState, useEffect } from "react";

const ViewReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    //Fetch data from server
  }, []);

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Reports</h2>
      {reports.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Driver Name</th>
              <th className="py-2 px-4 border-b">Plate Number</th>
              <th className="py-2 px-4 border-b">Fuel Capacity</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{report.driverName}</td>
                <td className="py-2 px-4 border-b">{report.plateNumber}</td>
                <td className="py-2 px-4 border-b">{report.fuelCapacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No reports available.</p>
      )}
    </div>
  );
};

export default ViewReports;
