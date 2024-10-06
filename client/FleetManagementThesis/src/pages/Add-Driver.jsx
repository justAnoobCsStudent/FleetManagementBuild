import React, { useState } from "react";
import { Button, buttonVariants } from "../components/ui/button";
import useValidateForm from "@/hooks/useValidateForm";
import validateDriverForm from "@/utils/validateDriverForm";
import useAddDrivers from "@/hooks/useAddDrivers";

const AddDriver = () => {
  // Set the initial form state to default values
  const initialFormState = {
    firstName: "",
    lastName: "",
    middleInitial: "",
    licenseNumber: "",
    age: "",
    phoneNumber: "",
    gender: "",
  };

  // Destructure form handling utilities from useValidateForm hook
  const { formData, errors, handleChange, validate } = useValidateForm(
    initialFormState, // Pass the initial form state
    validateDriverForm // Validation function
  );

  // Destructure form submission handler from useAddDrivers hook
  const { handleSubmit, loading } = useAddDrivers(
    "/drivers/register", // API endpoint to add driver
    initialFormState, // Initial state of form submitted
    validate // Validate form
  );

  // Return add driver form
  return (
    <div className="w=100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
        {/* First Name */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.firstName ? "border-red-500" : ""
            }`}
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.lastName ? "border-red-500" : ""
            }`}
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        {/* Middle Initial */}
        <div className="mb-4">
          <label
            htmlFor="middleInitial"
            className="block text-sm font-medium text-gray-700"
          >
            Middle Initial
          </label>
          <input
            type="text"
            id="middleInitial"
            name="middleInitial"
            value={formData.middleInitial}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.middleInitial ? "border-red-500" : ""
            }`}
            required
          />
          {errors.middleInitial && (
            <p className="text-red-500 text-sm">{errors.middleInitial}</p>
          )}
        </div>

        {/* License Number */}
        <div className="mb-4">
          <label
            htmlFor="licenseNumber"
            className="block text-sm font-medium text-gray-700"
          >
            License Number
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.licenseNumber ? "border-red-500" : ""
            }`}
            required
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
          )}
        </div>

        {/* Age */}
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.age ? "border-red-500" : ""
            }`}
            required
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneNumber ? "border-red-500" : ""
            }`}
            required
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.gender ? "border-red-500" : ""
            }`}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          {loading ? (
            <ClipLoader color="#000" loading={isLoading} />
          ) : (
            <Button type="submit" className="mt-4">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDriver;
