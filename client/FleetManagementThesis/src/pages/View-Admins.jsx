import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal"; // Assume you have a Modal component
import Spinner from "@/components/Spinner";

const ViewAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:7000/api/v1/users/admins",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmins(response.data.data);
      } catch (error) {
        setError("Error fetching admins");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Toggle modal for deletion confirmation
  const toggleModal = (admin = null) => {
    setSelectedAdmin(admin);
    setShowModal(!showModal);
  };

  // Handle admin deletion
  const handleDeleteAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:7000/api/v1/users/${selectedAdmin.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the admins list locally after successful deletion
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== selectedAdmin.id)
      );

      // Close the modal
      toggleModal();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Admins</h2>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-700">{error}</p>
      ) : admins.length > 0 ? (
        <>
          {/* Table layout for medium and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Display Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="text-center">
                    <td className="py-2 px-4 border-b">{admin.displayName}</td>
                    <td className="py-2 px-4 border-b">{admin.email}</td>
                    <td className="py-2 px-4 border-b flex flex-col items-center space-y-1">
                      <Button
                        onClick={() => navigate(`/edit-admin/${admin.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white w-32"
                      >
                        Edit Admin
                      </Button>
                      <Button
                        onClick={() => toggleModal(admin)}
                        className="bg-red-500 hover:bg-red-600 text-white w-32"
                      >
                        Delete Admin
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for smaller screens */}
          <div className="md:hidden space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white border rounded-lg shadow p-4"
              >
                <p>
                  <strong>Display Name:</strong> {admin.displayName}
                </p>
                <p>
                  <strong>Email:</strong> {admin.email}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={() => navigate(`/edit-admin/${admin.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-32"
                  >
                    Edit Admin
                  </Button>
                  <Button
                    onClick={() => toggleModal(admin)}
                    className="bg-red-500 hover:bg-red-600 text-white w-32"
                  >
                    Delete Admin
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">No admins available.</p>
      )}

      {/* Delete Admin Modal */}
      {showModal && (
        <Modal onClose={() => toggleModal()}>
          <h2 className="text-xl font-semibold mb-4">Confirm Delete Admin</h2>
          <p>Are you sure you want to delete {selectedAdmin?.displayName}?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={handleDeleteAdmin}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Delete Admin
            </Button>
            <Button
              onClick={() => toggleModal()}
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

export default ViewAdmins;
