import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../Firebase";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner"; // Import the Spinner component

const ViewReport = () => {
  const { reportId } = useParams(); // Get the report ID from the URL params
  const [reportData, setReportData] = useState(null); // Store the fetched report data
  const [isLoading, setIsLoading] = useState(true); // Manage loading state
  const navigate = useNavigate(); // For navigation

  // Function to get the color of the bar based on fuel used
  const getFuelBarColor = (fuelUsed) => {
    if (fuelUsed < 33) return "bg-green-500"; // Low fuel used
    if (fuelUsed < 66) return "bg-yellow-500"; // Medium fuel used
    return "bg-red-500"; // High fuel used
  };

  // Format timestamp to "November 19, 2024"
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Invalid Date";

    const datePart = timestamp.split(",")[0]; // Get only the date part (mm/dd/yyyy)
    const date = new Date(datePart);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // Full month name
      day: "numeric",
    });
  };

  // Format timestamp for the PDF file name
  const formatForPDFName = (timestamp) => {
    if (!timestamp) return "Invalid_Date";

    const datePart = timestamp.split(",")[0]; // Get only the date part (mm/dd/yyyy)
    const date = new Date(datePart);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .replace(/ /g, "_"); // Replace spaces with underscores
  };

  // Fetch data for the given report ID
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

  // Function to generate PDF
  const downloadPDF = () => {
    const element = document.getElementById("pdf-content");
    const pdfName = `${formatForPDFName(reportData.timestamp)}_Report.pdf`;

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(pdfName);
    });
  };

  // Show a loading spinner while the report data is being fetched
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner /> {/* Show Spinner during loading */}
      </div>
    );
  }

  // Show a fallback state if no report is fetched
  if (!reportData) {
    return (
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-xl font-semibold">
          Report not available.
        </p>
      </div>
    );
  }

  const { trucks, alarmCounts, timestamp } = reportData;

  // Sort the trucks by truck_id sequence (TRUCK01, TRUCK02, TRUCK03)
  const sortedTrucks = Object.values(trucks).sort((a, b) =>
    a.truck_id.localeCompare(b.truck_id)
  );

  const formattedTimestamp = formatTimestamp(timestamp);

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Buttons Section */}
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

      <div
        id="pdf-content"
        className="bg-gray-100 p-6 mb-6 w-full border border-gray-400 rounded-lg"
      >
        <h1 className="text-2xl font-semibold text-start mb-4">
          Report Details for {formattedTimestamp}
        </h1>

        {/* Trucks Data */}
        {sortedTrucks.map((truck) => (
          <div
            key={truck.truck_id}
            className="bg-white p-4 rounded-lg shadow w-full flex flex-col mb-4"
          >
            <h3 className="text-xl font-semibold mb-4">{truck.truck_id}</h3>
            <p className="text-md font-medium mb-2">
              Driver: {truck.driverName}
            </p>
            <p className="text-md font-medium mb-4">
              Plate Number: {truck.plateNumber}
            </p>
            <div className="w-full bg-gray-300 rounded-full h-8 overflow-hidden relative">
              <div
                className={`${getFuelBarColor(truck.fuelUsed)} h-full`}
                style={{
                  width: `${truck.fuelUsed}%`,
                }}
              ></div>
              <p className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                {truck.fuelUsed}%
              </p>
            </div>
          </div>
        ))}

        {/* Alarm Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-4">Fuel Theft Alarms</h3>
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-red-100">
              <p className="text-3xl font-bold text-red-600">
                {alarmCounts?.fuelTheft || 0}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-4">Geofence Alarms</h3>
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100">
              <p className="text-3xl font-bold text-blue-600">
                {alarmCounts?.geofence || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
