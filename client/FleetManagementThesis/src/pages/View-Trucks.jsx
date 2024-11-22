import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify"; // Import toast

const ViewTrucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState({
    assign: false,
    deleteDriver: false,
    deleteTruck: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [trucksResponse, driversResponse] = await Promise.all([
          axios.get("http://localhost:7000/api/v1/vehicles"),
          axios.get("http://localhost:7000/api/v1/drivers"),
        ]);
        setTrucks(trucksResponse.data.data);
        setDrivers(driversResponse.data.data);
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleModal = (modalType, truck = null) => {
    setSelectedTruck(truck);
    setShowModal((prev) => ({ ...prev, [modalType]: !prev[modalType] }));
  };

  const handleAssignDriver = async () => {
    if (!selectedDriver) return;
    try {
      await axios.put(
        `http://localhost:7000/api/v1/vehicles/add-driver/${selectedTruck.id}`,
        {
          driverId: selectedDriver,
        }
      );
      toggleModal("assign");
      setTrucks((prevTrucks) =>
        prevTrucks.map((truck) =>
          truck.id === selectedTruck.id
            ? { ...truck, driver: drivers.find((d) => d.id === selectedDriver) }
            : truck
        )
      );
      toast.success("Driver assigned successfully!");
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Failed to assign driver.");
    }
  };

  const handleDeleteDriver = async () => {
    try {
      await axios.put(
        `http://localhost:7000/api/v1/vehicles/delete-driver/${selectedTruck.id}`
      );
      toggleModal("deleteDriver");
      setTrucks((prevTrucks) =>
        prevTrucks.map((truck) =>
          truck.id === selectedTruck.id ? { ...truck, driver: null } : truck
        )
      );
      toast.success("Driver unassigned successfully!");
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to unassign driver.");
    }
  };

  const handleDeleteTruck = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/v1/vehicles/${selectedTruck.id}`
      );
      toggleModal("deleteTruck");
      setTrucks((prevTrucks) =>
        prevTrucks.filter((truck) => truck.id !== selectedTruck.id)
      );
      toast.success("Truck deleted successfully!");
    } catch (error) {
      console.error("Error deleting truck:", error);
      toast.error("Failed to delete truck.");
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Trucks</h2>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700">{error}</p>
      ) : trucks.length > 0 ? (
        <>
          {/* Table layout for medium and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Truck ID</th>
                  <th className="py-2 px-4 border-b">Driver</th>
                  <th className="py-2 px-4 border-b">Unit</th>
                  <th className="py-2 px-4 border-b">Plate Number</th>
                  <th className="py-2 px-4 border-b">Color</th>
                  <th className="py-2 px-4 border-b">Transmission</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck) => (
                  <tr key={truck.id} className="text-center">
                    <td className="py-2 px-4 border-b">{truck.truck_id}</td>
                    <td className="py-2 px-4 border-b">
                      {truck.driver?.name ? (
                        `${truck.driver.name.lastName}, ${truck.driver.name.firstName}`
                      ) : (
                        <span className="text-gray-500">
                          No Driver Assigned
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{truck.unit}</td>
                    <td className="py-2 px-4 border-b">{truck.plateNumber}</td>
                    <td className="py-2 px-4 border-b">{truck.color}</td>
                    <td className="py-2 px-4 border-b">{truck.transmission}</td>
                    <td className="py-2 px-4 border-b flex flex-col space-y-1">
                      {!truck.driver?.name && (
                        <Button
                          onClick={() => toggleModal("assign", truck)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Assign Driver
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate(`/edit-truck/${truck.id}`)}
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        Edit Truck
                      </Button>
                      {truck.driver?.name && (
                        <Button
                          onClick={() => toggleModal("deleteDriver", truck)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Unassign Driver
                        </Button>
                      )}
                      <Button
                        onClick={() => toggleModal("deleteTruck", truck)}
                        className="bg-red-700 hover:bg-red-800 text-white"
                      >
                        Delete Truck
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No trucks available.</p>
      )}

      {/* Modals */}
      {showModal.assign && (
        <Modal onClose={() => toggleModal("assign")}>
          <h2 className="text-xl font-semibold mb-4">Assign Driver</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col mb-4">
              {drivers.map((driver) => (
                <label
                  key={driver.id}
                  className="justify-start items-center mb-2"
                >
                  <input
                    type="radio"
                    name="driver"
                    value={driver.id}
                    onChange={() => setSelectedDriver(driver.id)}
                    checked={selectedDriver === driver.id}
                    className="mr-2"
                  />
                  {`${driver.name.lastName}, ${driver.name.firstName}`}
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleAssignDriver}
                disabled={!selectedDriver}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Assign
              </Button>
              <Button
                onClick={() => toggleModal("assign")}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showModal.deleteDriver && (
        <Modal onClose={() => toggleModal("deleteDriver")}>
          <h2 className="text-xl font-semibold mb-4">
            Confirm Unassign Driver
          </h2>
          <p>Are you sure you want to unassign the driver from this truck?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={handleDeleteDriver}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Unassign Driver
            </Button>
            <Button
              onClick={() => toggleModal("deleteDriver")}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {showModal.deleteTruck && (
        <Modal onClose={() => toggleModal("deleteTruck")}>
          <h2 className="text-xl font-semibold mb-4">Confirm Delete Truck</h2>
          <p>Are you sure you want to delete this truck?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={handleDeleteTruck}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Delete Truck
            </Button>
            <Button
              onClick={() => toggleModal("deleteTruck")}
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

export default ViewTrucks;
