import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <>
      {/* Not Found Page Component */}
      <section className="text-center flex flex-col justify-center items-center h-96">
        <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
        <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
        <p className="text-xl mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Go Back Home
          </Button>
        </Link>
      </section>
    </>
  );
};

export default NotFoundPage;
