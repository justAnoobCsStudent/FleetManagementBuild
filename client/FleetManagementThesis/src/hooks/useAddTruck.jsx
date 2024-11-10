import React, { useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

// Custom hook for adding trucks using API
const useAddTruck = (endpoint, initialFormState, validate) => {
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
        // Performing POST request using baseURL and endpoint
        const response = await axios.post(`${baseURL}${endpoint}`, formData);
        console.log("Response:", response);
        if (response.status === 201) {
          setSuccess(true); // Set success to true
          toast.success("Truck added successfully!", { position: "top-right" }); // Success toast
          navigate("/view-trucks"); // Navigate to View Trucks page
        }
      } catch (error) {
        // Catching submission error
        console.error("Error submitting form: ", error);

        // Display error toast
        toast.error(error.response?.data?.message || "Failed to add truck.", {
          position: "top-right",
        });
      } finally {
        // Stop the loading spinner
        setIsLoading(false);
      }
    }
  };

  // Return useAddTruck hook properties
  return {
    handleSubmit, // Handle submission logic
    isLoading, // Boolean flag for loading form
    success, // Boolean flag for form state
  };
};

export default useAddTruck;
