import { Button } from "../components/ui/button";
import Spinner from "@/components/Spinner";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "@/components/Modal";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import baseURL from "@/config/config";

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoading(true);
      try {
        const driversResponse = await axios.get(`${baseURL}/drivers`);
        setDrivers(driversResponse.data.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const handleOpenDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedDriver(null);
    setShowDeleteModal(false);
  };

  const handleDeleteDriver = async () => {
    try {
      await axios.delete(`${baseURL}/drivers/${selectedDriver.id}`);
      handleCloseDeleteModal();
      setDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => driver.id !== selectedDriver.id)
      );
      toast.success(
        `Driver ${selectedDriver.name.firstName} ${selectedDriver.name.lastName} deleted successfully!`
      ); // Success toast
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to delete driver. Please try again."); // Error toast
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Drivers</h2>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700">Error fetching data: {error.message}</p>
      ) : drivers.length > 0 ? (
        <>
          <div className="hidden md:block overflow-x-auto">
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
                    <td className="py-2 px-4 border-b">
                      {driver.name.firstName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {driver.name.lastName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {driver.name.middleInitial}.
                    </td>
                    <td className="py-2 px-4 border-b">
                      {driver.licenseNumber}
                    </td>
                    <td className="py-2 px-4 border-b">{driver.age}</td>
                    <td className="py-2 px-4 border-b">{driver.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">{driver.gender}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex flex-col space-y-2">
                        <Link to={`/view-driver/${driver.id}`}>
                          <Button className="bg-gray-500 hover:bg-gray-600 text-white w-full">
                            View
                          </Button>
                        </Link>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white w-full"
                          onClick={() => handleOpenDeleteModal(driver)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for smaller screens */}
          <div className="block md:hidden space-y-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white border rounded-lg shadow p-4"
              >
                <p>
                  <strong>First Name:</strong> {driver.name.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {driver.name.lastName}
                </p>
                <p>
                  <strong>Middle Initial:</strong> {driver.name.middleInitial}
                </p>
                <p>
                  <strong>License Number:</strong> {driver.licenseNumber}
                </p>
                <p>
                  <strong>Age:</strong> {driver.age}
                </p>
                <p>
                  <strong>Phone Number:</strong> {driver.phoneNumber}
                </p>
                <p>
                  <strong>Gender:</strong> {driver.gender}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/view-driver/${driver.id}`}>
                    <Button className="bg-gray-500 hover:bg-gray-600 text-white w-full">
                      View
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white w-full"
                    onClick={() => handleOpenDeleteModal(driver)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
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
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Driver
            </Button>
            <Button
              onClick={handleCloseDeleteModal}
              className="bg-gray-500 hover:bg-gray-600 text-white"
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
