import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, buttonVariants } from "../components/ui/button";

const ViewTrucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //prodURL
  const prodURL = "https://thesis-api-bmpc.onrender.com";
  //devURL
  const devURL = "http://localhost:7000/api/v1";

  useEffect(() => {
    //Fetch trucks from server
    const fetchTrucks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${devURL}/vehicles`);
        setTrucks(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrucks();
  }, []);

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Trucks</h2>
      {trucks.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Truck ID</th>
              <th className="py-2 px-4 border-b">Driver</th>
              <th className="py-2 px-4 border-b">Unit</th>
              <th className="py-2 px-4 border-b">Plate Number</th>
              <th className="py-2 px-4 border-b">Color</th>
              <th className="py-2 px-4 border-b">Transmission</th>
              <th className="py-2 px-4 border-b">~Distance Travelled</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{truck.truck_id}</td>
                <td className="py-2 px-4 border-b">
                  {truck.driver.name.lastName}, {truck.driver.name.firstName}
                </td>
                <td className="py-2 px-4 border-b">{truck.unit}</td>
                <td className="py-2 px-4 border-b">{truck.plateNumber}</td>
                <td className="py-2 px-4 border-b">{truck.color}</td>
                <td className="py-2 px-4 border-b">{truck.transmission}</td>
                <td className="py-2 px-4 border-b">{truck.odometer}</td>
                <td className="py-2 px-4 border-b ">
                  <Button
                    className={
                      buttonVariants({ variant: "primary" }) + "px-2 py-1 mr-2"
                    }
                  >
                    View
                  </Button>
                  <Button
                    className={
                      buttonVariants({ variant: "destructive" }) + "px-2 py-1"
                    }
                  >
                    Delete
                  </Button>
                </td>
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
