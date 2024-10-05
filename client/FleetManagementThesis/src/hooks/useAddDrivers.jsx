import React, { useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";
import { useNavigate } from "react-router-dom";

const useAddDrivers = (endpoint, initialFormState, validate) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${baseURL}${endpoint}`, formData);
        if (response.status === 201) {
          setSuccess(true);
          alert("Driver added successfully");
          navigate("/view-drivers");
        }
      } catch (error) {
        console.error("Error submitting form: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    handleSubmit,
    isLoading,
    success,
  };
};

export default useAddDrivers;
