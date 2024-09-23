import React, { useState } from "react";

const AddDriver = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleInitial: "",
    licenseNumber: "",
    age: "",
    phoneNumber: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    // Validate first name
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    // Validate last name
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    // Validate middle initial (1 character)
    if (!formData.middleInitial || formData.middleInitial.length !== 1) {
      newErrors.middleInitial = "Middle initial must be 1 character";
    }

    // Validate license number (min 6 characters)
    if (!formData.licenseNumber || formData.licenseNumber.length < 6) {
      newErrors.licenseNumber = "License number must be at least 6 characters";
    }

    // Validate age (must be a number and >= 18)
    if (!formData.age || formData.age < 18) {
      newErrors.age = "Driver must be at least 18 years old";
    }

    // Validate Philippine phone number
    const phonePattern = /^(09\d{9}|(\+639)\d{9})$/;
    if (!phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must be a valid Philippine number starting with 09 or +639";
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted", formData);
    } else {
      console.log("Validation errors", errors);
    }
  };

  return (
    <div className="w=100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
      <form onSubmit={handleSubmit}>
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
            maxLength="1"
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
            minLength="6"
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
            min="18"
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
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="(09\d{9})|(\+639\d{9})"
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneNumber ? "border-red-500" : ""
            }`}
            placeholder="09123456789 or +639123456789"
            required
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <div className="mt-1 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
                className="form-radio text-blue-600"
                required
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
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

export default AddDriver;
