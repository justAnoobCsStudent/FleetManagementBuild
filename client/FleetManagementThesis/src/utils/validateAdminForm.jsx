const validateAdminForm = (formData) => {
  const errors = {};

  if (!formData.displayName.trim()) {
    errors.displayName = "Display Name is required.";
  }
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Valid email is required.";
  }
  if (!formData.password.trim() || formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  return errors;
};

export default validateAdminForm;
