import React from "react";
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
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import useValidateForm from "@/hooks/useValidateForm";
import validateTruckForm from "@/utils/validateTruckForm";
import useAddTruck from "@/hooks/useAddTruck";

const AddTruck = () => {
  const initialFormState = {
    truck_id: "",
    unit: "",
    plateNumber: "",
    color: "",
    transmission: "",
    odometer: "",
  };

  const { formData, errors, handleChange, validate } = useValidateForm(
    initialFormState,
    validateTruckForm
  );

  const { handleSubmit, loading } = useAddTruck(
    "/vehicles/register",
    initialFormState,
    validate,
    {
      onSuccess: () => {
        toast.success("Truck added successfully!", { position: "top-right" });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add truck.", {
          position: "top-right",
        });
      },
    }
  );

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-4">Add New Truck</h2>
      <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-4">
        {/* Unit */}
        <div>
          <Label htmlFor="unit" className="block mb-1">
            Unit
          </Label>
          <Input
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className={errors.unit ? "border-red-500" : ""}
            required
          />
          {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
        </div>

        {/* Plate Number */}
        <div>
          <Label htmlFor="plateNumber" className="block mb-1">
            Plate Number
          </Label>
          <Input
            id="plateNumber"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            className={errors.plateNumber ? "border-red-500" : ""}
            required
          />
          {errors.plateNumber && (
            <p className="text-red-500 text-sm">{errors.plateNumber}</p>
          )}
        </div>

        {/* Color */}
        <div>
          <Label htmlFor="color" className="block mb-1">
            Color
          </Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={errors.color ? "border-red-500" : ""}
            required
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color}</p>
          )}
        </div>

        {/* Transmission */}
        <div>
          <Label className="block mb-5">Transmission</Label>
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
              Automatic (AT)
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
              Manual (MT)
            </Label>
          </div>
        </div>

        {/* Truck ID Dropdown */}
        <div>
          <Label className="block mb-1">Truck ID</Label>
          <Select
            onValueChange={(value) =>
              handleChange({ target: { name: "truck_id", value } })
            }
          >
            <SelectTrigger className={errors.truck_id ? "border-red-500" : ""}>
              <SelectValue placeholder="--Select Truck ID--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRUCK01">TRUCK 01</SelectItem>
              <SelectItem value="TRUCK02">TRUCK 02</SelectItem>
              <SelectItem value="TRUCK03">TRUCK 03</SelectItem>
            </SelectContent>
          </Select>
          {errors.truck_id && (
            <p className="text-red-500 text-sm">{errors.truck_id}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white mt-4 w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTruck;
