import React, { useState } from "react";

const useValidateForm = (initialState, validateFormCallback) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const validationErrors = validateFormCallback(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
  };
};

export default useValidateForm;
