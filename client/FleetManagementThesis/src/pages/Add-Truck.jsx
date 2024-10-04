import React, { useState } from "react";
import { Button, buttonVariants } from "../components/ui/button";
import axios from "axios";

//prodURL
const prodURL = "https://thesis-api-bmpc.onrender.com";
//devURL
const devURL = "http://localhost:7000/api/v1";

const AddTruck = () => {
  const [formData, setFormData] = useState({
    truck_id: "",
    unit: "",
    plateNumber: "",
    yearPurchased: "",
    color: "",
    transmission: "",
    odometer: "",
  });

  const [submissionStatus, setSubmissionsStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission
      const response = await axios.post(
        `${devURL}/vehicles/register`,
        formData
      );

      if (response.status === 201) {
        setSubmissionsStatus("Form submitted successfully!");
        console.log("Form submitted successfully:", response.data);
      } else {
        setSubmissionsStatus("Error submitting form.");
      }
    } catch (error) {
      setSubmissionsStatus("Error submitting form.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Truck</h2>
      <form onSubmit={handleSubmit}>
        {/* Unit */}
        <div className="mb-4">
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Plate Number */}
        <div className="mb-4">
          <label
            htmlFor="plateNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Plate Number
          </label>
          <input
            type="text"
            id="plateNumber"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Color */}
        <div className="mb-4">
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Transmission */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Transmission
          </label>
          <div className="mt-1 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="transmission"
                value="AT"
                checked={formData.transmission === "AT"}
                onChange={handleChange}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Automatic (AT)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="transmission"
                value="MT"
                checked={formData.transmission === "MT"}
                onChange={handleChange}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Manual (MT)</span>
            </label>
          </div>
        </div>

        {/* Truck ID Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Truck ID
          </label>
          <select
            name="truckID"
            value={formData.truckID}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option>--Select Truck ID--</option>
            <option value="TRUCK01">TRUCK 01</option>
            <option value="TRUCK02">TRUCK 02</option>
            <option value="TRUCK03">TRUCK 03</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            className={
              "w-full py-2 px-4 rounded-md shadow-md" +
              buttonVariants({ variant: "primary" })
            }
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTruck;
