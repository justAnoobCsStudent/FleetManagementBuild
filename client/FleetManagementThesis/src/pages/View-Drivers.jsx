import { Button, buttonVariants } from "../components/ui/button";
import Spinner from "@/components/Spinner";
import useFetch from "@/hooks/useFetch";

const ViewDrivers = () => {
  // Destructure the custom hook's response to fetch driver data
  const {
    data: drivers, // Contain the fetch data
    isLoading, // Boolean flag for loading state
    error, // Error encountered during fetching
  } = useFetch("/drivers");

  // Return View drivers
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
                <td className="py-2 px-4 border-b ">
                  <Button
                    className={`${buttonVariants({
                      variant: "primary",
                    })} + px-2 py-1 mr-2`}
                  >
                    View
                  </Button>
                  <Button
                    className={`${buttonVariants({
                      variant: "destructive",
                    })} + px-2 py-1`}
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
    </div>
  );
};

export default ViewDrivers;
