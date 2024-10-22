import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import Modal from "@/components/modal"; // Assume you have a modal component
import Spinner from "@/components/Spinner";

const ViewTrucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, isError] = useState();
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteTruckModal, setShowDeleteTruckModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the trucks and drivers data
    const fetchData = async () => {
      try {
        const trucksResponse = await axios.get(
          `http://localhost:7000/api/v1/vehicles`
        );
        const driversResponse = await axios.get(
          `http://localhost:7000/api/v1/drivers`
        );
        setTrucks(trucksResponse.data.data);
        setDrivers(driversResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAssignDriver = async (truckId) => {
    try {
      await axios.put(
        `http://localhost:7000/api/v1/vehicles/add-driver/${truckId}`,
        {
          driverId: selectedDriver,
        }
      );
      // Close modal and reload the trucks list
      setShowModal(false);
      setSelectedTruck(null);
      setSelectedDriver(null);
      const trucksResponse = await axios.get(
        `http://localhost:7000/api/v1/vehicles`
      );
      setTrucks(trucksResponse.data.data); // Re-fetch trucks to reflect the assigned driver
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  const handleOpenModal = (truck) => {
    setSelectedTruck(truck);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTruck(null);
    setSelectedDriver(null);
  };

  const handleOpenDeleteConfirmModal = (truck) => {
    setSelectedTruck(truck);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setSelectedTruck(null);
  };

  const handleDeleteDriver = async () => {
    try {
      await axios.put(
        `http://localhost:7000/api/v1/vehicles/delete-driver/${selectedTruck.id}`
      );
      // Close confirmation modal and reload trucks list
      setShowDeleteConfirmModal(false);
      const trucksResponse = await axios.get(
        `http://localhost:7000/api/v1/vehicles`
      );
      setTrucks(trucksResponse.data.data); // Re-fetch trucks to reflect changes
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleOpenDeleteTruckModal = (truck) => {
    setSelectedTruck(truck);
    setShowDeleteTruckModal(true);
  };

  const handleCloseDeleteTruckModal = () => {
    setShowDeleteTruckModal(false);
    setSelectedTruck(null);
  };

  const handleDeleteTruck = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/v1/vehicles/${selectedTruck.id}`
      );
      // Close confirmation modal and reload trucks list
      setShowDeleteTruckModal(false);
      const trucksResponse = await axios.get(
        `http://localhost:7000/api/v1/vehicles`
      );
      setTrucks(trucksResponse.data.data); // Re-fetch trucks to reflect changes
    } catch (error) {
      console.error("Error deleting truck:", error);
    }
  };

  return (
    <div className="w-100 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Trucks</h2>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700">Error fetching data: {error.message}</p>
      ) : trucks.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Truck ID</th>
              <th className="py-2 px-4 border-b">Driver</th>
              <th className="py-2 px-4 border-b">Unit</th>
              <th className="py-2 px-4 border-b">Plate Number</th>
              <th className="py-2 px-4 border-b">Color</th>
              <th className="py-2 px-4 border-b">Transmission</th>
              <th className="py-2 px-4 border-b">~Distance Travelled</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.truck_id} className="text-center">
                <td className="py-2 px-4 border-b">{truck.truck_id}</td>
                <td className="py-2 px-4 border-b">
                  {truck.driver.name &&
                  truck.driver.name.firstName &&
                  truck.driver.name.lastName ? (
                    `${truck.driver.name.lastName}, ${truck.driver.name.firstName} `
                  ) : (
                    <span className="text-gray-500"> No Driver Assigned</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{truck.unit}</td>
                <td className="py-2 px-4 border-b">{truck.plateNumber}</td>
                <td className="py-2 px-4 border-b">{truck.color}</td>
                <td className="py-2 px-4 border-b">{truck.transmission}</td>
                <td className="py-2 px-4 border-b">{truck.odometer}</td>
                <td className="py-2 px-4 border-b flex flex-col">
                  {!truck.driver.name && (
                    <Button
                      onClick={() => handleOpenModal(truck)}
                      className="bg-blue-500 text-white mb-1"
                    >
                      Assign Driver
                    </Button>
                  )}
                  {truck.driver && (
                    <Button
                      onClick={() => navigate(`/edit-truck/${truck.id}`)}
                      className="bg-gray-500 text-white mb-1"
                    >
                      Edit Truck
                    </Button>
                  )}
                  {truck.driver.id && (
                    <Button
                      onClick={() => {
                        handleOpenDeleteConfirmModal(truck);
                      }}
                      className={
                        buttonVariants({
                          variant: "destructive",
                        }) + "text-white"
                      }
                    >
                      Unassign Driver
                    </Button>
                  )}
                  <Button
                    onClick={() => handleOpenDeleteTruckModal(truck)}
                    className="bg-red-500 text-white "
                  >
                    Delete Truck
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No trucks available.</p>
      )}

      {/* Assign Driver Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-xl font-semibold mb-4">Assign Driver</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="driver"
                      value={driver.id}
                      onChange={() => setSelectedDriver(driver.id)}
                      checked={selectedDriver === driver.id}
                    />
                    <span className="ml-2">{`${driver.name.lastName}, ${driver.name.firstName}`}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => handleAssignDriver(selectedTruck.id)}
                className="bg-green-500 text-white"
                disabled={!selectedDriver}
              >
                Assign
              </Button>
              <Button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Unassign Driver Confirmation Modal */}
      {showDeleteConfirmModal && (
        <Modal onClose={handleCloseDeleteConfirmModal}>
          <h2 className="text-xl font-semibold mb-4">Confirm Unassign</h2>
          <p>Are you sure you want to unassign the driver from this truck?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={handleDeleteDriver}
              className="bg-red-500 text-white"
            >
              Unassign Driver
            </Button>
            <Button
              onClick={handleCloseDeleteConfirmModal}
              className="bg-gray-500 text-white"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete Truck Confirmation Modal */}
      {showDeleteTruckModal && (
        <Modal onClose={handleCloseDeleteTruckModal}>
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this truck?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={handleDeleteTruck}
              className="bg-red-500 text-white"
            >
              Delete Truck
            </Button>
            <Button
              onClick={handleCloseDeleteTruckModal}
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

export default ViewTrucks;
