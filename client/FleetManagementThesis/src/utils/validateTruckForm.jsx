// Utility for validating truck form
const validateTruckForm = (formData) => {
  let errors = {}; // Store any error

  // Validation for truck id
  if (!formData.truck_id) {
    errors.truck_id = "Truck ID is required";
  }

  // Validation for unit
  if (!formData.unit) {
    errors.unit = "Unit is required";
  }

  // Validation for plate number
  // Should be 5 characters above
  if (!formData.plateNumber) {
    errors.plateNumber = "Plate number is required";
  } else if (formData.plateNumber.length < 5) {
    errors.plateNumber = "Plate number must be at least 5 characters";
  }

  // Validation for color
  if (!formData.color) {
    errors.color = "Color is required";
  }

  // Validation for transmission
  if (!formData.transmission) {
    errors.transmission = "Transmission type is required";
  }

  return errors;
};

export default validateTruckForm;
