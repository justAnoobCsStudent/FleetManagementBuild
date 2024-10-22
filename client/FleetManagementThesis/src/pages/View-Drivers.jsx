import { Button, buttonVariants } from "../components/ui/button";
import Spinner from "@/components/Spinner";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "@/components/Modal";
import axios from "axios";

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Fetch the drivers data
    const fetchDrivers = async () => {
      try {
        const driversResponse = await axios.get(
          `http://localhost:7000/api/v1/drivers`
        );
        setDrivers(driversResponse.data.data);
        console.log(driversResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDrivers();
  }, []);

  // Function to open the delete confirmation modal
  const handleOpenDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  // Function to close the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setSelectedDriver(null);
    setShowDeleteModal(false);
  };

  // Function to handle deleting a driver
  const handleDeleteDriver = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/v1/drivers/${selectedDriver.id}`
      );
      // Close modal after deletion
      setShowDeleteModal(false);

      const driversResponse = await axios.get(
        `http://localhost:7000/api/v1/drivers`
      );
      setIsDrivers(driversResponse.data.data); // Re-fetch drivers to reflect the assigned driver
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };
  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Drivers</h2>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700"> Error fetching data: {error.message}</p>
      ) : drivers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Middle Initial</th>
              <th className="py-2 px-4 border-b">License Number</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="text-center">
                <td className="py-2 px-4 border-b">{driver.name.firstName}</td>
                <td className="py-2 px-4 border-b">{driver.name.lastName}</td>
                <td className="py-2 px-4 border-b">
                  {driver.name.middleInitial}.
                </td>
                <td className="py-2 px-4 border-b">{driver.licenseNumber}</td>
                <td className="py-2 px-4 border-b">{driver.age}</td>
                <td className="py-2 px-4 border-b">{driver.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{driver.gender}</td>
                <td className="py-2 px-4 border-b flex flex-col">
                  <Link to={`/view-driver/${driver.id}`}>
                    <Button
                      className={`${buttonVariants({
                        variant: "primary",
                      })} + mb-1`}
                    >
                      View
                    </Button>
                  </Link>
                  <Button
                    className={`${buttonVariants({
                      variant: "destructive",
                    })} + mb-1`}
                    onClick={() => handleOpenDeleteModal(driver)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No drivers available.</p>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal onClose={handleCloseDeleteModal}>
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p>
            Are you sure you want to delete {selectedDriver?.name.firstName}{" "}
            {selectedDriver?.name.lastName}?
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={handleDeleteDriver}
              className="bg-red-500 text-white"
            >
              Delete Driver
            </Button>
            <Button
              onClick={handleCloseDeleteModal}
              className="bg-gray-500 text-white"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewDrivers;
