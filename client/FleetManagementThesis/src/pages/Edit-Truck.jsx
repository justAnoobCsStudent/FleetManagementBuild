import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

const EditTruck = () => {
  const { id } = useParams(); // Get truck ID from the URL
  const navigate = useNavigate(); // To navigate back after saving
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state to manage edited data
  const [formData, setFormData] = useState({
    unit: "",
    plateNumber: "",
    yearPurchased: "",
    color: "",
    transmission: "",
    odometer: "",
  });

  // Fetch truck data from the API
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/vehicles/${id}`
        );
        const fetchedTruck = response.data.data;
        setTruck(response.data.data);
        setFormData({
          unit: fetchedTruck.unit || "",
          plateNumber: fetchedTruck.plateNumber || "",
          yearPurchased: fetchedTruck.yearPurchased || "",
          color: fetchedTruck.color || "",
          transmission: fetchedTruck.transmission || "",
          truckID: fetchedTruck.truckID || "", // Populate the truck ID
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching truck data:", error);
        setLoading(false);
      }
    };

    fetchTruck();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTruck((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:7000/api/v1/vehicles/${id}`, truck);
      navigate(`/view-trucks`); // Redirect back to view trucks after saving
    } catch (error) {
      console.error("Error updating truck data:", error);
    }
  };

  // Handle cancel edit mode
  const handleCancelEdit = () => {
    navigate(`/view-trucks`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (!truck) {
    return <div>Truck not found</div>; // Show message if truck data is not available
  }

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Truck</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="unit" className="block font-semibold">
            Unit
          </label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="plateNumber" className="block font-semibold">
            Plate Number
          </label>
          <input
            type="text"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="color" className="block font-semibold">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Transmission</label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="transmission"
              value="AT"
              checked={formData.transmission === "AT"}
              onChange={handleChange}
            />
            <span className="ml-2">Automatic</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              name="transmission"
              value="MT"
              checked={formData.transmission === "MT"}
              onChange={handleChange}
            />
            <span className="ml-2">Manual</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Truck ID</label>
          <select
            name="truck_id"
            value={formData.truck_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">--Select Truck ID--</option>
            <option value="TRUCK01">TRUCK 01</option>
            <option value="TRUCK02">TRUCK 02</option>
            <option value="TRUCK03">TRUCK 03</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTruck;
