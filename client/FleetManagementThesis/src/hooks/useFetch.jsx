import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";

// Custom hook for fetching data from API
const useFetch = (endpoint) => {
  const [data, setData] = useState([]); // State to store fetched data
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State to store errors

  useEffect(() => {
    // Data fetching
    const fetchData = async () => {
      try {
        // Perform GET request using baseURL and endpoint
        const response = await axios.get(`${baseURL}${endpoint}`);
        setData(response.data.data); // Store response to data in state
      } catch (error) {
        setError(error); // Store and catch errors
      } finally {
        setIsLoading(false); // Stop the loading spinner
      }
    };
    fetchData(); // Trigger data fetch function
  }, [endpoint]); // Re-run the effect if endpoint change

  return { data, isLoading, error }; // Return data, loading state, and any errors
};

export default useFetch;
