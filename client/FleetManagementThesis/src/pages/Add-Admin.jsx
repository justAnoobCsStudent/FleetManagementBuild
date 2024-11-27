import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "@/config/config";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.displayName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.post(`${baseURL}/users/register`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Admin added successfully!", { position: "top-right" });
      navigate("/view-admins"); // Redirect to View Admins page
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(error.response?.data?.message || "Failed to add admin.", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name */}
        <div>
          <Label htmlFor="displayName" className="mb-1">
            Display Name
          </Label>
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="mb-1">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="mb-1">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white mt-4 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
