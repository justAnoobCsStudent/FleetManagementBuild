import React, { useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";
import { useNavigate } from "react-router-dom";

// Custom hook for adding drivers using API
const useAddDrivers = (endpoint, initialFormState, validate) => {
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [success, setSuccess] = useState(false); // State for form status
  const navigate = useNavigate(); // Hook to navigate to other routes

  // Form submission
  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    // Form validation
    if (validate()) {
      setIsLoading(true);
      try {
        // Performing POST request using baseURL and enpoint
        const response = await axios.post(`${baseURL}${endpoint}`, formData);
        if (response.status === 201) {
          setSuccess(true); // Set the setSucess to true
          alert("Driver added successfully"); // Alert box for adding driver sucessfully
          navigate("/view-drivers"); // Navigate to View Driver page
        }
      } catch (error) {
        // Catching submission error
        console.error("Error submitting form: ", error);
      } finally {
        // Stop the loading spinner
        setIsLoading(false);
      }
    }
  };

  // Return useAddDrivers hook properties
  return {
    handleSubmit, // Handle submission logic
    isLoading, // Boolean flag for loading form
    success, // Boolean flag for form state
  };
};

export default useAddDrivers;
