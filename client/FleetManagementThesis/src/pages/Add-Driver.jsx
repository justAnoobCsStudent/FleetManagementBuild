import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useValidateForm from "@/hooks/useValidateForm";
import validateDriverForm from "@/utils/validateDriverForm";
import useAddDrivers from "@/hooks/useAddDrivers";
import ClipLoader from "react-spinners/ClipLoader"; // Assuming you're using ClipLoader for loading

const AddDriver = () => {
  const initialFormState = {
    firstName: "",
    lastName: "",
    middleInitial: "",
    licenseNumber: "",
    age: "",
    phoneNumber: "",
    gender: "",
  };

  const { formData, errors, handleChange, validate } = useValidateForm(
    initialFormState,
    validateDriverForm
  );

  const { handleSubmit, loading } = useAddDrivers(
    "/drivers/register",
    initialFormState,
    validate
  );

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
      <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-4">
        {/* First Name */}
        <div>
          <Label htmlFor="firstName" className="mb-1">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName" className="mb-1">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        {/* Middle Initial */}
        <div>
          <Label htmlFor="middleInitial" className="mb-1">
            Middle Initial
          </Label>
          <Input
            id="middleInitial"
            name="middleInitial"
            value={formData.middleInitial}
            onChange={handleChange}
            required
            className={errors.middleInitial ? "border-red-500" : ""}
          />
          {errors.middleInitial && (
            <p className="text-red-500 text-sm">{errors.middleInitial}</p>
          )}
        </div>

        {/* License Number */}
        <div>
          <Label htmlFor="licenseNumber" className="mb-1">
            License Number
          </Label>
          <Input
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className={errors.licenseNumber ? "border-red-500" : ""}
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <Label htmlFor="age" className="mb-1">
            Age
          </Label>
          <Input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="mb-1">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Gender - Radio Buttons */}
        <div>
          <Label className="block mb-1">Gender</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) =>
              handleChange({ target: { name: "gender", value } })
            }
            className="flex space-x-4"
            required
          >
            <div className="flex items-center">
              <RadioGroupItem value="Male" id="male" className="mr-2" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="Female" id="female" className="mr-2" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          {loading ? (
            <ClipLoader color="#000" loading={loading} />
          ) : (
            <Button type="submit" className="mt-4 w-full">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDriver;
