import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const EditTruck = () => {
  const { id } = useParams(); // Get truck ID from the URL
  const navigate = useNavigate(); // To navigate back after saving
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state to manage edited data
  const [formData, setFormData] = useState({
    unit: "",
    plateNumber: "",
    yearPurchased: "",
    color: "",
    transmission: "",
    odometer: "",
  });

  // Fetch truck data from the API
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/vehicles/${id}`
        );
        const fetchedTruck = response.data.data;
        setTruck(fetchedTruck);
        setFormData({
          unit: fetchedTruck.unit || "",
          plateNumber: fetchedTruck.plateNumber || "",
          yearPurchased: fetchedTruck.yearPurchased || "",
          color: fetchedTruck.color || "",
          transmission: fetchedTruck.transmission || "",
          truckID: fetchedTruck.truckID || "", // Populate the truck ID
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching truck data:", error);
        setLoading(false);
      }
    };

    fetchTruck();
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
      await axios.put(`http://localhost:7000/api/v1/vehicles/${id}`, formData);
      navigate(`/view-trucks`); // Redirect back to view trucks after saving
    } catch (error) {
      console.error("Error updating truck data:", error);
    }
  };

  // Handle cancel edit mode
  const handleCancelEdit = () => {
    navigate(`/view-trucks`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (!truck) {
    return <div>Truck not found</div>; // Show message if truck data is not available
  }

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Truck</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Unit */}
        <div>
          <Label htmlFor="unit" className="mb-1">
            Unit
          </Label>
          <Input
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </div>

        {/* Plate Number */}
        <div>
          <Label htmlFor="plateNumber" className="mb-1">
            Plate Number
          </Label>
          <Input
            id="plateNumber"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Color */}
        <div>
          <Label htmlFor="color" className="mb-1">
            Color
          </Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>

        {/* Transmission */}
        <div>
          <Label className="mb-1">Transmission</Label>
          <div className="flex space-x-4">
            <Label className="inline-flex items-center">
              <input
                type="radio"
                name="transmission"
                value="AT"
                checked={formData.transmission === "AT"}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Automatic
            </Label>
            <Label className="inline-flex items-center">
              <input
                type="radio"
                name="transmission"
                value="MT"
                checked={formData.transmission === "MT"}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Manual
            </Label>
          </div>
        </div>

        {/* Truck ID Dropdown */}
        <div>
          <Label className="mb-1">Truck ID</Label>
          <Select
            onValueChange={(value) =>
              handleChange({ target: { name: "truckID", value } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="--Select Truck ID--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRUCK01">TRUCK 01</SelectItem>
              <SelectItem value="TRUCK02">TRUCK 02</SelectItem>
              <SelectItem value="TRUCK03">TRUCK 03</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Button type="submit" variant="primary" className="w-full">
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancelEdit}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTruck;
