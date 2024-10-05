const validateTruckForm = (formData) => {
  let errors = {};

  if (!formData.truck_id) {
    errors.truck_id = "Truck ID is required";
  }

  if (!formData.unit) {
    errors.unit = "Unit is required";
  }

  if (!formData.plateNumber) {
    errors.plateNumber = "Plate number is required";
  } else if (formData.plateNumber.length < 5) {
    errors.plateNumber = "Plate number must be at least 5 characters";
  }

  if (!formData.color) {
    errors.color = "Color is required";
  }

  if (!formData.transmission) {
    errors.transmission = "Transmission type is required";
  }

  return errors;
};

export default validateTruckForm;
