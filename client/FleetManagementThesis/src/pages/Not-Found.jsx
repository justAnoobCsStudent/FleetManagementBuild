import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <>
      {/* Not Found Page Component */}
      <section className="text-center flex flex-col justify-center items-center h-96">
        <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
        <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
        <p className="text-xl mb-5">This page does not exist</p>
        {/* Link to Home Page */}
        <Link>
          <Button
            className={"" + buttonVariants({ variant: "primary" })}
            type="submit"
          >
            Go Back
          </Button>
        </Link>
      </section>
    </>
  );
};

export default NotFoundPage;
