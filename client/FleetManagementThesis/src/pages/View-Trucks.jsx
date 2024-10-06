import { Button, buttonVariants } from "../components/ui/button";
import Spinner from "../components/Spinner";
import useFetch from "@/hooks/useFetch";

const ViewTrucks = () => {
  // Destructure the custom hook's response to fetch driver data
  const {
    data: trucks, // Contain the fetch data
    isLoading, // Boolean flag for loading state
    error, // Error encountered during fetching
  } = useFetch("/vehicles");

  // Return View trucks
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
                  {truck.driver &&
                  truck.driver.firstName &&
                  truck.driver.lastName ? (
                    `${truck.driver.lastName}, ${truck.driver.firstName} `
                  ) : (
                    <span className="text-gray-500"> No Driver Assigned</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{truck.unit}</td>
                <td className="py-2 px-4 border-b">{truck.plateNumber}</td>
                <td className="py-2 px-4 border-b">{truck.color}</td>
                <td className="py-2 px-4 border-b">{truck.transmission}</td>
                <td className="py-2 px-4 border-b">{truck.odometer}</td>
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
        <p className="text-gray-600">No trucks available.</p>
      )}
    </div>
  );
};

export default ViewTrucks;
