// Utility for validating driver form
const validateDriverForm = (formData) => {
  let errors = {}; // Store any error

  // Validation for first name
  if (!formData.firstName) {
    errors.firstName = "First name is required";
  }

  // Validation for last name
  if (!formData.lastName) {
    errors.lastName = "Last name is required";
  }

  // Validation for middle initial
  if (!formData.middleInitial || formData.middleInitial.length !== 1) {
    // Should be 1 character only
    errors.middleInitial = "Middle initial must be 1 character";
  }

  // Validation for license number
  // Should be 6 characters above
  if (!formData.licenseNumber || formData.licenseNumber.length < 6) {
    errors.licenseNumber = "License number must be at least 6 characters";
  }

  // Validation for age
  // Should be 18 years old above
  if (!formData.age || formData.age < 18) {
    errors.age = "Driver must be at least 18 years old";
  }

  // Validation for phone number
  // Should start 09 or +63
  const phonePattern = /^(09\d{9}|(\+639)\d{9})$/;
  if (!phonePattern.test(formData.phoneNumber)) {
    errors.phoneNumber =
      "Phone number must be a valid Philippine number starting with 09 or +639";
  }

  // Validation for gender
  if (!formData.gender) {
    errors.gender = "Gender is required";
  }

  return errors;
};

export default validateDriverForm;
