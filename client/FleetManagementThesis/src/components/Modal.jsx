import React from "react";

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">{children}</div>
    </div>
  );
};

export default Modal;
