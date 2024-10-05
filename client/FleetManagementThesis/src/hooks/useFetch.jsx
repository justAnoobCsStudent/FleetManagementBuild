import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "@/config/config";

// Creating custom hook to fetch data using axios
const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}${endpoint}`); // baseURL + endpoint to get the data
        setData(response.data.data);
      } catch (error) {
        setError(error); // Catch if there an error
      } finally {
        setIsLoading(false); // Setting the loader to false
      }
    };
    fetchData();
  }, [endpoint]);
  return { data, isLoading, error };
};

export default useFetch;
