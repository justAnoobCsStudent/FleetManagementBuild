import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../components/ui/button";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../Firebase";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ViewReport = () => {
  const { reportId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Invalid Date";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatForPDFName = (timestamp) => {
    if (!timestamp) return "Invalid_Date";
    const date = new Date(timestamp);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .replace(/ /g, "_");
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!reportId) {
          console.error("Report ID is not provided.");
          setIsLoading(false);
          return;
        }
        const reportRef = doc(firestore, "daily_reports", reportId);
        const reportSnapshot = await getDoc(reportRef);
        if (reportSnapshot.exists()) {
          setReportData(reportSnapshot.data());
        } else {
          console.error(`Report with ID ${reportId} not found.`);
        }
      } catch (error) {
        console.error("Error fetching the report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const downloadPDF = () => {
    const pdfName = `${formatForPDFName(reportData.timestamp)}_Report.pdf`;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;

    // Capture the main content
    const mainContent = document.getElementById("main-content");
    const truckDetails = document.getElementById("truck-details");

    html2canvas(mainContent, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the main content to the first page
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // If the main content overflows the page, calculate how much is left
      let heightLeft = imgHeight - pageHeight;

      if (heightLeft > 0) {
        while (heightLeft > 0) {
          pdf.addPage();
          heightLeft -= pageHeight;
        }
      }

      // Add truck details on the second page
      pdf.addPage();

      html2canvas(truckDetails, { scale: 2 }).then((canvas) => {
        const truckImgData = canvas.toDataURL("image/png");
        const truckImgWidth = pageWidth;
        const truckImgHeight = (canvas.height * truckImgWidth) / canvas.width;

        pdf.addImage(truckImgData, "PNG", 0, 0, truckImgWidth, truckImgHeight);
        pdf.save(pdfName);
      });
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-xl font-semibold">
          Report not available.
        </p>
      </div>
    );
  }

  const { trucks, alarms, timestamp } = reportData;

  const sortedTrucks = Object.values(trucks).sort((a, b) =>
    a.truck_id.localeCompare(b.truck_id)
  );

  const chartData = {
    labels: sortedTrucks.map((truck) => truck.truck_id),
    datasets: [
      {
        label: "Fuel Used (%)",
        data: sortedTrucks.map((truck) => truck.averageFuelUsed),
        backgroundColor: "rgba(75,192,192,0.5)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "Average Distance (km)",
        data: sortedTrucks.map((truck) => truck.averageDistance),
        backgroundColor: "rgba(255,99,132,0.5)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
    ],
  };

  const totalFuelTheftAlarms = Object.values(alarms.fuelTheft.trucks).reduce(
    (sum, truck) => sum + truck.alarmCount,
    0
  );

  const totalGeofenceAlarms = Object.values(alarms.geofence.trucks).reduce(
    (sum, truck) => sum + truck.alarmCount,
    0
  );

  const fuelTheftAlarmData = {
    labels: Object.keys(alarms.fuelTheft.trucks),
    datasets: [
      {
        data: Object.values(alarms.fuelTheft.trucks).map(
          (truck) => truck.alarmCount
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const geofenceAlarmData = {
    labels: Object.keys(alarms.geofence.trucks),
    datasets: [
      {
        data: Object.values(alarms.geofence.trucks).map(
          (truck) => truck.alarmCount
        ),
        backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
        hoverBackgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
      },
    ],
  };

  const formattedTimestamp = formatTimestamp(timestamp);

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <Button
          className={buttonVariants({ variant: "secondary" })}
          onClick={() => navigate("/view-reports")}
        >
          Back
        </Button>
        <Button
          className={buttonVariants({ variant: "primary" })}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </div>

      {/* Main content for the first page */}
      <div
        id="main-content"
        className="bg-gray-100 p-6 mb-6 w-full border border-gray-400 rounded-lg"
      >
        <h1 className="text-2xl font-semibold text-start mb-4">
          Report Details for {formattedTimestamp}
        </h1>

        <div className="mb-6">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Fuel Used (%) and Average Distance (km)",
                },
              },
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Fuel Theft Alarms (Total: {totalFuelTheftAlarms})
            </h2>
            <Pie data={fuelTheftAlarmData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Geofence Alarms (Total: {totalGeofenceAlarms})
            </h2>
            <Pie data={geofenceAlarmData} />
          </div>
        </div>
      </div>

      {/* Truck details for the second page */}
      <div id="truck-details">
        {sortedTrucks.map((truck) => (
          <div
            key={truck.truck_id}
            className="bg-white p-4 rounded-lg shadow w-full flex flex-col mb-4"
          >
            <h3 className="text-xl font-semibold mb-4">{truck.truck_id}</h3>
            <p className="text-md font-medium mb-2">
              Driver: {truck.driverName}
            </p>
            <p className="text-md font-medium mb-2">
              Plate Number: {truck.plateNumber}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReport;
