import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewDriver = () => {
  const { id } = useParams(); // Get driver ID from the URL
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
        const response = await axios.get(
          `http://localhost:7000/api/v1/drivers/${id}`
        ); // API endpoint
        setDriver(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching driver data.");
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

  // Handle form submission for updating truck details
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:7000/api/v1/drivers/${id}`, formData); // Update API call
      setIsEditing(false); // Switch back to view mode after saving
      setDriver({ ...driver, ...formData });
    } catch (error) {
      setError("Error updating driver data.");
    }
  };

  // Handle entering edit mode and populating formData with current driver data
  const handleEditClick = () => {
    setFormData({
      firstName: driver.name.firstName,
      lastName: driver.name.lastName,
      middleInitial: driver.name.middleInitial,
      licenseNumber: driver.licenseNumber,
      age: driver.age,
      phoneNumber: driver.phoneNumber,
      gender: driver.gender,
    });
    setIsEditing(true);
  };

  // Handle cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: driver.name.firstName,
      lastName: driver.name.lastName,
      middleInitial: driver.name.middleInitial,
      licenseNumber: driver.licenseNumber,
      age: driver.age,
      phoneNumber: driver.phoneNumber,
      gender: driver.gender,
    });
  };

  if (loading) {
    return <div>Loading driver details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Driver Details</h1>

          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Driver
            </button>
          )}
        </div>

        {isEditing ? (
          // Edit Mode Form
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label htmlFor="unit" className="block font-semibold">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="plateNumber" className="block font-semibold">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="color" className="block font-semibold">
                Middle Initial
              </label>
              <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="color" className="block font-semibold">
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="color" className="block font-semibold">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="color" className="block font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Gender</label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="AT"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />
                <span className="ml-2">Female</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
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
