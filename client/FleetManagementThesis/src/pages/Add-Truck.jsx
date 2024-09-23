import React, { useState } from "react";

const AddTruck = () => {
  const [formData, setFormData] = useState({
    brand: "",
    unit: "",
    plateNumber: "",
    yearPurchased: "",
    color: "",
    transmission: "",
    odometer: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted", formData);
  };

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Truck</h2>
      <form onSubmit={handleSubmit}>
        {/* Brand */}
        <div className="mb-4">
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700"
          >
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

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

        {/* Year Purchased */}
        <div className="mb-4">
          <label
            htmlFor="yearPurchased"
            className="block text-sm font-medium text-gray-700"
          >
            Year Purchased
          </label>
          <input
            type="number"
            id="yearPurchased"
            name="yearPurchased"
            value={formData.yearPurchased}
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

        {/* Odometer */}
        <div className="mb-4">
          <label
            htmlFor="odometer"
            className="block text-sm font-medium text-gray-700"
          >
            Odometer (km)
          </label>
          <input
            type="number"
            id="odometer"
            name="odometer"
            value={formData.odometer}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTruck;
