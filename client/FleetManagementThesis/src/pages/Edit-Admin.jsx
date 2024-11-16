import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditAdmin = () => {
  const { id } = useParams(); // Get admin ID from the URL
  const navigate = useNavigate(); // To navigate back after saving
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state to manage edited data
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  // Fetch admin data from the API
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:7000/api/v1/users/admins`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedAdmin = response.data.data.find(
          (admin) => admin.id === id
        );
        if (!fetchedAdmin) {
          throw new Error("Admin not found");
        }

        setAdmin(fetchedAdmin);
        setFormData({
          displayName: fetchedAdmin.displayName || "",
          email: fetchedAdmin.email || "",
          password: "", // Leave password blank for security
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = { ...formData };

      // Exclude password if it's empty
      if (!payload.password) {
        delete payload.password;
      }

      await axios.put(`http://localhost:7000/api/v1/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Admin updated successfully!"); // Success toast
      navigate(`/view-admins`); // Redirect back to view admins after saving
    } catch (error) {
      console.error("Error updating admin data:", error);
      toast.error("Failed to update admin. Please try again."); // Error toast
    }
  };

  const handleCancelEdit = () => {
    navigate(`/view-admins`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (!admin) {
    return <div>Admin not found</div>; // Show message if admin data is not available
  }

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Admin</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
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
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white w-full"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancelEdit}
            className="bg-red-500 hover:bg-red-600 text-white w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAdmin;
