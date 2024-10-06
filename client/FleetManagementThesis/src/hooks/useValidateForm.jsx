import React, { useState } from "react";

// Custom hook for validating form
const useValidateForm = (initialState, validateFormCallback) => {
  const [formData, setFormData] = useState(initialState); // State to store form data
  const [errors, setErrors] = useState({}); // State to store error

  // Function to handle changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to validate form
  const validate = () => {
    const validationErrors = validateFormCallback(formData);
    setErrors(validationErrors); // Store errors
    return Object.keys(validationErrors).length === 0;
  };

  // Return useValidateForm hook properties
  return {
    formData,
    errors,
    handleChange,
    validate,
  };
};

export default useValidateForm;
