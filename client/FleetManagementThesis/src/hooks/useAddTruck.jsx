import React, { useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";
import { useNavigate } from "react-router-dom";

const useAddTruck = (endpoint, initialFormState, validate) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sucess, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${baseURL}${endpoint}`, formData);
        console.log("Response:", response);
        if (response.status === 201) {
          setSuccess(true);
          alert("Truck Added successfully");
          navigate("/view-trucks");
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
    sucess,
  };
};

export default useAddTruck;
