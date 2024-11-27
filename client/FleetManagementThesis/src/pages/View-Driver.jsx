import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import baseURL from "@/config/config";

const ViewDriver = () => {
  const { id } = useParams(); // Get driver ID from URL
  const [driver, setDriver] = useState(null); // Driver data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const navigate = useNavigate();

  // Form state to manage edited data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleInitial: "",
    licenseNumber: "",
    age: "",
    phoneNumber: "",
    gender: "",
  });

  // Fetch driver data from API or server
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await axios.get(`${baseURL}/drivers/${id}`); // API endpoint
        setDriver(response.data.data);
        setFormData({
          firstName: response.data.data.name.firstName,
          lastName: response.data.data.name.lastName,
          middleInitial: response.data.data.name.middleInitial,
          licenseNumber: response.data.data.licenseNumber,
          age: response.data.data.age,
          phoneNumber: response.data.data.phoneNumber,
          gender: response.data.data.gender,
        });
      } catch (error) {
        setError("Error fetching driver data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for updating driver details
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/drivers/${id}`, formData); // Update API call
      setDriver({ ...driver, ...formData });
      setIsEditing(false); // Switch back to view mode after saving
      toast.success("Driver updated successfully!"); // Success toast
    } catch (error) {
      setError("Error updating driver data.");
      toast.error("Failed to update driver. Please try again."); // Error toast
    }
  };

  // Handle entering edit mode
  const handleEditClick = () => setIsEditing(true);

  // Handle cancel edit mode
  const handleCancelEdit = () => setIsEditing(false);

  if (loading) return <div>Loading driver details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Driver Details</h1>
          {!isEditing && (
            <Button
              onClick={handleEditClick}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Edit Driver
            </Button>
          )}
        </div>

        {isEditing ? (
          // Edit Mode Form
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label>Middle Initial</Label>
              <Input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Label>License Number</Label>
              <Input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label>Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label>Gender</Label>
              <div className="flex space-x-4">
                <Label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  <span>Male</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  <span>Female</span>
                </Label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          // View Mode
          <div>
            <p>
              <strong>First Name:</strong> {driver.name.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {driver.name.lastName}
            </p>
            <p>
              <strong>Middle Initial:</strong> {driver.name.middleInitial}
            </p>
            <p>
              <strong>License Number:</strong> {driver.licenseNumber}
            </p>
            <p>
              <strong>Age:</strong> {driver.age}
            </p>
            <p>
              <strong>Phone Number:</strong> {driver.phoneNumber}
            </p>
            <p>
              <strong>Gender:</strong> {driver.gender}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDriver;
