import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, buttonVariants } from "../components/ui/button";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //prodURL
  const prodURL = "https://thesis-api-bmpc.onrender.com";
  //devURL
  const devURL = "http://localhost:7000/api/v1";

  useEffect(() => {
    //Fetch data from server
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${devURL}/reports`);
        setReports(response.data.data);
        console.log(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Reports</h2>
      {reports.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Truck ID</th>
              <th className="py-2 px-4 border-b">Driver Name</th>
              <th className="py-2 px-4 border-b">Plate Number</th>
              <th className="py-2 px-4 border-b">Fuel Capacity</th>
              <th className="py-2 px-4 border-b">Average Distance</th>
              <th className="py-2 px-4 border-b">Date Generated</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{report.truck_id}</td>
                <td className="py-2 px-4 border-b">{report.driverName}</td>
                <td className="py-2 px-4 border-b">{report.plateNumber}</td>
                <td className="py-2 px-4 border-b">{report.fuelCapacity}</td>
                <td className="py-2 px-4 border-b">{report.averageDistance}</td>
                <td className="py-2 px-4 border-b">{report.timestamp}</td>
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
