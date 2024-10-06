import React from "react";
import { Button, buttonVariants } from "../components/ui/button";
import useValidateForm from "@/hooks/useValidateForm";
import validateTruckForm from "@/utils/validateTruckForm";
import useAddTruck from "@/hooks/useAddTruck";

const AddTruck = () => {
  // Set the initial form state to default values
  const initialFormState = {
    truck_id: "",
    unit: "",
    plateNumber: "",
    color: "",
    transmission: "",
    odometer: "",
  };

  // Destructure form handling utilities from useValidateForm hook
  const { formData, errors, handleChange, validate } = useValidateForm(
    initialFormState, // Pass the initial form state
    validateTruckForm // Validation function
  );

  // Destructure form submission handler from useAddDrivers hook
  const { handleSubmit, loading } = useAddTruck(
    "/vehicles/register", // API endpoint to add truck
    initialFormState, // Initial state of form submitted
    validate // Validate form
  );

  // Return add driver form
  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Truck</h2>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
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
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.unit ? "border-red-500" : ""
            }`}
            required
          />
          {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
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
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.plateNumber ? "border-red-500" : ""
            }`}
            required
          />
          {errors.plateNumber && (
            <p className="text-red-500 text-sm">{errors.plateNumber}</p>
          )}
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
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.color ? "border-red-500" : ""
            }`}
            required
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color}</p>
          )}
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
            name="truck_id"
            value={formData.truck_id}
            onChange={handleChange}
            className={`w-full p-2 border border-gray-300 rounded-md ${
              errors.truck_id ? "border-red-500" : ""
            }`}
          >
            <option value="">--Select Truck ID--</option>
            <option value="TRUCK01">TRUCK 01</option>
            <option value="TRUCK02">TRUCK 02</option>
            <option value="TRUCK03">TRUCK 03</option>
          </select>
          {errors.truck_id && (
            <p className="text-red-500 text-sm">{errors.truck_id}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          {loading ? (
            <ClipLoader color="#000" loading={isLoading} />
          ) : (
            <Button
              type="submit"
              className={
                "mt-4 w-full py-2 px-4 rounded-md shadow-md" +
                buttonVariants({ variant: "primary" })
              }
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTruck;
