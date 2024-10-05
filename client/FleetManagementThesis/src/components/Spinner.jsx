import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

// Spinner Design
const override = {
  display: "block",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const Spinner = ({ loading }) => {
  return (
    // Spinner Component
    <ClipLoader
      color="#4338ca"
      loading={loading}
      cssOverride={override}
      size={150}
    />
  );
};

export default Spinner;
