import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { firestore, database } from "../Firebase";
import { Button } from "../components/ui/button";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

const ViewReports = () => {
  const trucks = ["TRUCK01", "TRUCK02", "TRUCK03"]; // Static array of truck IDs
  const [fuelTheftCount, setFuelTheftCount] = useState(0); // Count for Fuel Theft alarms
  const [geofenceCount, setGeofenceCount] = useState(0); // Count for Geofence alarms
  const [fuelData, setFuelData] = useState({}); // Fuel data for each truck
  const [reports, setReports] = useState([]); // All reports
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfDay = today;
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const alarmsRef = collection(firestore, "alarms");

        // Fetch Fuel Theft alarms
        const fuelTheftQuery = query(
          alarmsRef,
          where("timestamp", ">=", startOfDay),
          where("timestamp", "<=", endOfDay),
          where("type", "==", "Fuel Theft")
        );
        const fuelTheftSnapshot = await getDocs(fuelTheftQuery);
        setFuelTheftCount(fuelTheftSnapshot.size);

        // Fetch Geofence alarms
        const geofenceQuery = query(
          alarmsRef,
          where("timestamp", ">=", startOfDay),
          where("timestamp", "<=", endOfDay),
          where("type", "==", "Geofence")
        );
        const geofenceSnapshot = await getDocs(geofenceQuery);
        setGeofenceCount(geofenceSnapshot.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch truck fuel data and update fuelData
  useEffect(() => {
    const fuelRef = ref(database, "fuel_data");

    const unsubscribeFuel = onValue(fuelRef, (snapshot) => {
      const data = snapshot.val() || {};
      const newFuelData = {};

      trucks.forEach((truckId) => {
        if (data[truckId]) {
          const fuelEntries = data[truckId];
          const latestEntry = fuelEntries && Object.keys(fuelEntries).pop();
          const currentFuel = latestEntry
            ? fuelEntries[latestEntry].fuel_percentage || 0
            : 0;

          newFuelData[truckId] = {
            fuel_used: 100 - currentFuel, // Calculate fuel used as the inverse of current fuel
          };
        } else {
          newFuelData[truckId] = { fuel_used: 100 }; // If no data, assume full usage
        }
      });

      setFuelData(newFuelData);
    });

    return unsubscribeFuel; // Clean-up for fuel listener
  }, [trucks]); // Re-run only when trucks change

  // Fetch all reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true); // Set loading state
        // Fetch "daily_reports" collection and order by timestamp descending
        const reportsRef = collection(firestore, "daily_reports");
        const reportsQuery = query(reportsRef, orderBy("timestamp", "desc"));
        const reportsSnapshot = await getDocs(reportsQuery);

        const fetchedReports = reportsSnapshot.docs.map((doc) => ({
          id: doc.id, // Get the document ID
          ...doc.data(),
        }));

        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false); // Remove loading state
      }
    };

    fetchReports();
  }, []);

  // Format a Firestore timestamp to "MMMM DD, YYYY"
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Invalid Date";

    if (typeof timestamp === "object" && timestamp.toDate) {
      timestamp = timestamp.toDate();
    }

    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // Use "long" for the full month name
      day: "numeric",
    });
  };

  // Determine the color based on the fuel used percentage
  const getFuelBarColor = (fuelUsed) => {
    if (fuelUsed < 33) return "bg-green-500"; // Low fuel used
    if (fuelUsed < 66) return "bg-yellow-500"; // Medium fuel used
    return "bg-red-500"; // High fuel used
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner /> {/* Show Spinner during loading */}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">
        Daily Report for{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h1>

      <div className="bg-gray-100 p-6 mb-6 w-full border-b border-gray-400">
        <div className="grid grid-cols-1 gap-6">
          {trucks.map((truckId) => (
            <div
              key={truckId}
              className="bg-white p-4 rounded-lg shadow w-full flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold mb-4">
                Fuel Used - {truckId}
              </h3>
              <div className="w-full bg-gray-300 rounded-full h-8 overflow-hidden relative">
                <div
                  className={`${getFuelBarColor(
                    fuelData[truckId]?.fuel_used || 0
                  )} h-full`}
                  style={{
                    width: `${fuelData[truckId]?.fuel_used || 0}%`,
                  }}
                ></div>
                <p className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                  {fuelData[truckId]?.fuel_used || 0}%
                </p>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">Fuel Theft Alarms</h3>
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-red-100">
                <p className="text-3xl font-bold text-red-600">
                  {fuelTheftCount}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">Geofence Alarms</h3>
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100">
                <p className="text-3xl font-bold text-blue-600">
                  {geofenceCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const formattedDate = formatTimestamp(report.timestamp);
              return (
                <tr key={report.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{formattedDate}</td>
                  <td className="border px-4 py-2">
                    <Link to={`/view-report/${report.id}`}>
                      <Button className="bg-gray-500 hover:bg-gray-600 text-white">
                        View Report
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewReports;
