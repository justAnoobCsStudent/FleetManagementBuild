import React, { useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

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
        // Performing POST request using baseURL and endpoint
        const response = await axios.post(`${baseURL}${endpoint}`, formData);
        if (response.status === 201) {
          setSuccess(true); // Set success to true
          toast.success("Driver added successfully!", {
            position: "top-right",
          }); // Success toast
          navigate("/view-drivers"); // Navigate to View Driver page
        }
      } catch (error) {
        // Handle submission errors
        console.error("Error submitting form: ", error);

        // Show error toast
        toast.error(error.response?.data?.message || "Failed to add driver.", {
          position: "top-right",
        });
      } finally {
        // Stop the loading spinner
        setIsLoading(false);
      }
    }
  };

  // Return hook properties
  return {
    handleSubmit, // Handle submission logic
    isLoading, // Boolean flag for loading form
    success, // Boolean flag for form state
  };
};

export default useAddDrivers;
