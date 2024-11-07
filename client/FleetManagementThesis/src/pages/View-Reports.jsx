import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore imports
import { firestore } from "../Firebase"; // Adjust the path to your Firebase setup
import { Button, buttonVariants } from "../components/ui/button";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ViewReports = () => {
  const trucks = [
    { id: "TRUCK01", plate: "ABC 1234", driver: "John Doe" },
    { id: "TRUCK02", plate: "DEF 5678", driver: "Jane Smith" },
    { id: "TRUCK03", plate: "GHI 9101", driver: "Alice Johnson" },
  ];

  const [alarmData, setAlarmData] = useState(Array(30).fill(0)); // Initialize with 30 days of data for November

  useEffect(() => {
    // Fetch alarm data from Firestore for November 2024
    const fetchAlarmData = async () => {
      try {
        const startOfMonth = new Date("2024-11-01");
        const endOfMonth = new Date("2024-11-30 23:59:59");

        // Firestore query to fetch alarms within the specified date range
        const alarmsRef = collection(firestore, "alarms");
        const alarmsQuery = query(
          alarmsRef,
          where("timestamp", ">=", startOfMonth),
          where("timestamp", "<=", endOfMonth)
        );
        const querySnapshot = await getDocs(alarmsQuery);

        // Process the alarm data
        const dailyAlarmCounts = Array(30).fill(0); // Initialize an array for each day of November

        querySnapshot.forEach((doc) => {
          const alarm = doc.data();
          const alarmDate = alarm.timestamp.toDate();
          const dayOfMonth = alarmDate.getDate() - 1; // Get the day of the month (0-based index)
          dailyAlarmCounts[dayOfMonth] += 1; // Increment count for the specific day
        });

        setAlarmData(dailyAlarmCounts); // Update the alarm data state
      } catch (error) {
        console.error("Error fetching alarm data from Firestore:", error);
      }
    };

    fetchAlarmData();
  }, []);

  // Example mock data for fuel and efficiency
  const fuelData = Array.from(
    { length: 30 },
    () => Math.floor(Math.random() * 20) + 40
  ); // Random values between 40 and 60
  const efficiencyData = Array.from(
    { length: 30 },
    () => Math.floor(Math.random() * 10) + 70
  ); // Random values between 70 and 80
  const labels = Array.from({ length: 30 }, (_, i) => `Nov ${i + 1}`); // Labels for each day in November

  // Chart configurations
  const fuelChartData = {
    labels,
    datasets: [
      {
        label: "Fuel Used (L)",
        data: fuelData,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };
  const efficiencyChartData = {
    labels,
    datasets: [
      {
        label: "Efficiency (%)",
        data: efficiencyData,
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
    ],
  };
  const alarmChartData = {
    labels,
    datasets: [
      {
        label: "Alarms Triggered",
        data: alarmData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">View Reports</h2>
      <div className="bg-gray-100 p-6 mb-6 w-full border-b border-gray-400">
        <h1 className="text-2xl font-semibold mb-4">
          Average Report for November 2024
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Average Fuel Used:</h3>
            <Line
              data={fuelChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Efficiency:</h3>
            <Line
              data={efficiencyChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Alarm Triggered:</h3>
            <Bar
              data={alarmChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 mb-6 w-full">
        {trucks.map((truck) => (
          <div key={truck.id} className="grid grid-cols-1 mb-5">
            <div className="bg-white p-4 rounded-lg shadow w-full flex justify-between items-center">
              <div>
                <p className="text-l font-semibold mb-2">
                  Truck Id: {truck.id}
                </p>
                <p className="text-l font-semibold mb-2">
                  Plate Number: {truck.plate}
                </p>
                <p className="text-l font-semibold mb-2">
                  Driver: {truck.driver}
                </p>
              </div>
              <Button className={buttonVariants({ variant: "primary" })}>
                View Truck
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReports;
