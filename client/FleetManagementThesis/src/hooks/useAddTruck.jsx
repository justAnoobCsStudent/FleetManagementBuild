import React, { useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";
import { useNavigate } from "react-router-dom";

// Custom hook for adding trucks using API
const useAddTruck = (endpoint, initialFormState, validate) => {
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [sucess, setSuccess] = useState(false); // State for form status
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
        console.log("Response:", response);
        if (response.status === 201) {
          setSuccess(true); // Set the setSucess to true
          alert("Truck Added successfully"); // Alert box for adding driver sucessfully
          navigate("/view-trucks"); // Navigate to View Driver page
        }
      } catch (error) {
        // Catching submission error
        console.error("Error submitting form: ", error);
      } finally {
        // Stop the laoding spinner
        setIsLoading(false);
      }
    }
  };

  // Return useAddTruck hook properties
  return {
    handleSubmit, // Handle submission logic
    isLoading, // Boolean flag for loading form
    sucess, // Boolean flag for form state
  };
};

export default useAddTruck;
