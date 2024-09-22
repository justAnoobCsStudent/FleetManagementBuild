import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-md py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Fleet Management. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
