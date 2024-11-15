import React, { useEffect, useState } from "react";
import L from "leaflet";
import { Polygon } from "react-leaflet";
import axios from "axios";
import { firestore } from "../Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { eventEmitter } from "../utils/eventEmitter";

const GeoFence = ({ truckPosition, truckName }) => {
  const [truckStates, setTruckStates] = useState({}); // Track states for each truck
  const [vehicleDocIds, setVehicleDocIds] = useState({}); // Track document IDs for each truck

  const reportsRef = collection(firestore, "reports");

  // Define the main and sub-geofence coordinates
  const mainGeofence = {
    name: "Main Geofence",
    coordinates: [
      [15.61409, 120.24788],
      [15.43198, 119.89251],
      [14.78592, 120.08862],
      [13.77525, 120.65539],
      [13.60211, 121.26968],
      [13.69182, 121.46172],
      [13.84683, 121.48206],
      [13.9285, 121.68729],
      [14.55813, 121.6233],
      [15.16394, 121.00013],
    ],
    color: "blue",
    fillOpacity: 0.1,
    outlineOpacity: 1,
  };

  const subGeofence = {
    name: "Daniellah's Junkshop",
    coordinates: [
      [14.317552082430042, 120.8611809242526],
      [14.317546884630769, 120.85873474967067],
      [14.316980323788703, 120.85868646990919],
      [14.317037499718372, 120.86127748377558],
    ],
    color: "red",
    fillOpacity: 0.4,
  };

  // Fetch the document ID of the truck from the vehicles collection
  useEffect(() => {
    const fetchVehicleDocId = async () => {
      try {
        const vehiclesRef = collection(firestore, "vehicles");
        const q = query(vehiclesRef, where("truck_id", "==", truckName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          setVehicleDocIds((prev) => ({ ...prev, [truckName]: docId }));
          console.log(`Found document ID for truck "${truckName}": ${docId}`);
        } else {
          console.warn(`Truck "${truckName}" not found in vehicles collection`);
        }
      } catch (error) {
        console.error("Error fetching vehicle document ID:", error.message);
      }
    };

    if (truckName && !vehicleDocIds[truckName]) {
      fetchVehicleDocId();
    }
  }, [truckName, vehicleDocIds]);

  useEffect(() => {
    if (truckPosition && vehicleDocIds[truckName]) {
      const mainGeoFencePoly = L.polygon(mainGeofence.coordinates);
      const subGeoFencePoly = L.polygon(subGeofence.coordinates);
      const truckCoordinates = L.latLng(truckPosition[0], truckPosition[1]);

      const isInsideMain = mainGeoFencePoly
        .getBounds()
        .contains(truckCoordinates);
      const isInsideSub = subGeoFencePoly
        .getBounds()
        .contains(truckCoordinates);

      const checkAndEmit = async (truckName, isInsideSub) => {
        try {
          const reportQuery = query(
            reportsRef,
            where("truckName", "==", truckName)
          );
          const querySnapshot = await getDocs(reportQuery);

          if (!querySnapshot.empty) {
            const reportDoc = querySnapshot.docs[0];
            const reportData = reportDoc.data();

            if (isInsideSub && !reportData.isInsideSub) {
              eventEmitter.emit("geofence:entry", {
                truckName,
                geofenceName: subGeofence.name,
              });
              await setDoc(doc(firestore, "reports", reportDoc.id), {
                ...reportData,
                isInsideSub: true,
              });
            } else if (!isInsideSub && reportData.isInsideSub) {
              eventEmitter.emit("geofence:exit", {
                truckName,
                geofenceName: subGeofence.name,
              });
              await setDoc(doc(firestore, "reports", reportDoc.id), {
                ...reportData,
                isInsideSub: false,
              });
            }
          } else {
            // If no report exists, create a new document
            await setDoc(doc(firestore, "reports", `${truckName}_report`), {
              truckName,
              isInsideSub,
            });
          }
        } catch (error) {
          console.error("Error checking and emitting geofence events:", error);
        }
      };

      // Check and emit for sub-geofence
      checkAndEmit(truckName, isInsideSub);

      // Main geofence logic: Emit alarm only when outside
      if (!isInsideMain) {
        eventEmitter.emit("geofence:outside", { truckName });
      }
    }
  }, [truckPosition, truckName, vehicleDocIds]);

  // Function to update the vehicle's isActive status
  const updateVehicleStatus = async (docId, isActiveStatus) => {
    try {
      await axios.put(`http://localhost:7000/api/v1/vehicles/${docId}`, {
        isActive: isActiveStatus,
      });
      console.log(
        `Truck "${truckName}" status updated to: ${
          isActiveStatus ? "Active" : "Inactive"
        }`
      );
    } catch (error) {
      console.error("Error updating truck status:", error);
    }
  };

  return (
    <>
      {/* Main Geofence */}
      <Polygon
        positions={mainGeofence.coordinates}
        color={mainGeofence.color}
        fillColor={mainGeofence.color}
        fillOpacity={mainGeofence.fillOpacity}
        opacity={mainGeofence.outlineOpacity} // Set outline opacity
      />

      {/* Sub Geofence */}
      <Polygon
        positions={subGeofence.coordinates}
        color={subGeofence.color}
        fillColor={subGeofence.color}
        fillOpacity={subGeofence.fillOpacity}
      />
    </>
  );
};

export default GeoFence;
