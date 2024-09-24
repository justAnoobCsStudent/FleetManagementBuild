import React from "react";
import { ClipLoader } from "react-spinners/ClipLoader";

// Spinner Design
const override = {
  display: "block",
  margin: "100px auto",
};

const Spinner = ({ loading }) => {
  return (
    <>
      {/* Spinner Component */}
      <ClipLoader
        color="#4338ca"
        loading={loading}
        cssOverride={override}
        sice={150}
      />
    </>
  );
};

export default Spinner;
