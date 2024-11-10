import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const useAddAdmins = (endpoint, initialFormState, validate) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      return; // Prevent form submission if there are validation errors
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:7000/api/v1${endpoint}`,
        { ...formData, role: "admin" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Admin added successfully!", { position: "top-right" });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add admin. Please try again.",
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};

export default useAddAdmins;
