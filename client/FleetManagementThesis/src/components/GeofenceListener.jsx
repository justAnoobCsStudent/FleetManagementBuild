import { toast } from "react-toastify";
import { eventEmitter } from "../utils/eventEmitter";
import { firestore } from "../Firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";
import React, { useEffect } from "react";

const GeoFenceListener = () => {
  useEffect(() => {
    const GeoFenceListener = {
      notifyEntry: async (truckName, geofenceName) => {
        const currentTime = new Date();
        const formattedTimestamp = currentTime.toLocaleString();
        toast.info(
          `${truckName} entered: ${geofenceName} at ${formattedTimestamp}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        await storeAlarm(
          truckName,
          `${truckName} entered: ${geofenceName} at ${formattedTimestamp}`,
          "Geofence",
          currentTime,
          true
        );
      },
      notifyExit: async (truckName, geofenceName) => {
        const currentTime = new Date();
        const formattedTimestamp = currentTime.toLocaleString();
        toast.info(
          `${truckName} exited: ${geofenceName} at ${formattedTimestamp}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        await storeAlarm(
          truckName,
          `${truckName} exited: ${geofenceName} at ${formattedTimestamp}`,
          "Geofence",
          currentTime,
          false
        );
      },
      notifyOutsideBoundary: async (truckName) => {
        const currentTime = new Date();
        const formattedTimestamp = currentTime.toLocaleString();
        toast.error(
          `${truckName} is outside the boundary at ${formattedTimestamp}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        await storeAlarm(
          truckName,
          `${truckName} is outside the boundary at ${formattedTimestamp}`,
          "Geofence",
          currentTime,
          false
        );
      },
      updateVehicleStatus: async (truckName, isActiveStatus) => {
        try {
          const vehiclesRef = collection(firestore, "vehicles");
          const q = query(vehiclesRef, where("truck_id", "==", truckName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;

            await axios.put(`http://localhost:7000/api/v1/vehicles/${docId}`, {
              isActive: isActiveStatus,
            });
            console.log(
              `Truck "${truckName}" status updated to: ${
                isActiveStatus ? "Active" : "Inactive"
              }`
            );
          } else {
            console.warn(
              `Truck "${truckName}" not found in vehicles collection.`
            );
          }
        } catch (error) {
          console.error("Error updating truck status:", error);
        }
      },
      generateVehicleReport: async (truckName) => {
        try {
          const vehiclesRef = collection(firestore, "vehicles");
          const q = query(vehiclesRef, where("truck_id", "==", truckName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;

            await axios.post(`http://localhost:7000/api/v1/reports/vehicle/`, {
              vehicleId: docId,
            });
            console.log(`Report generated for ${truckName}`);
          } else {
            console.warn(`${truckName} was not found in database.`);
          }
        } catch (error) {
          console.error("Error updating truck status:", error);
        }
      },
    };

    const storeAlarm = async (
      truckName,
      message,
      type,
      timestamp,
      isInsideSub
    ) => {
      try {
        const alarmsRef = collection(firestore, "alarms");
        const q = query(
          alarmsRef,
          where("truckName", "==", truckName),
          where("message", "==", message),
          where("type", "==", type)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(alarmsRef, {
            truckName,
            message,
            type,
            timestamp: Timestamp.fromDate(timestamp),
            isInsideSub,
            isRead: false,
          });
          console.log(`Stored alarm for truck "${truckName}" in Firestore.`);
        } else {
          console.log(
            `Duplicate alarm detected for truck "${truckName}". Skipping Firestore storage.`
          );
        }
      } catch (error) {
        console.error("Error storing alarm in Firestore:", error);
      }
    };

    const handleGeoFenceStatus = async ({
      truckName,
      isInsideSub1,
      isInsideSub2,
      isInsideMain,
      geofenceName,
    }) => {
      const reportsRef = collection(firestore, "reports");
      const reportQuery = query(
        reportsRef,
        where("truckName", "==", truckName)
      );
      const querySnapshot = await getDocs(reportQuery);

      if (!querySnapshot.empty) {
        const reportDoc = querySnapshot.docs[0];
        const reportData = reportDoc.data();

        // Handle sub-geofence 1
        if (isInsideSub1 !== reportData.isInsideSub1) {
          if (isInsideSub1) {
            GeoFenceListener.notifyEntry(truckName, "Daniellah's Junkshop");
            GeoFenceListener.updateVehicleStatus(truckName, false);
            GeoFenceListener.generateVehicleReport(truckName);
          } else {
            GeoFenceListener.notifyExit(truckName, "Daniellah's Junkshop");
            GeoFenceListener.updateVehicleStatus(truckName, true);
          }
          await setDoc(doc(firestore, "reports", reportDoc.id), {
            ...reportData,
            isInsideSub1,
          });
        }

        // Handle sub-geofence 2
        if (isInsideSub2 !== reportData.isInsideSub2) {
          if (isInsideSub2) {
            GeoFenceListener.notifyEntry(truckName, "SM Bacoor");
            GeoFenceListener.updateVehicleStatus(truckName, false);
            GeoFenceListener.generateVehicleReport(truckName);
          } else {
            GeoFenceListener.notifyExit(truckName, "SM Bacoor");
            GeoFenceListener.updateVehicleStatus(truckName, true);
          }
          await setDoc(doc(firestore, "reports", reportDoc.id), {
            ...reportData,
            isInsideSub2,
          });
        }
      } else {
        // Initialize a new report document for the truck
        await setDoc(doc(firestore, "reports", `${truckName}_report`), {
          truckName,
          isInsideSub1,
          isInsideSub2,
        });
      }

      // Handle main geofence exit
      if (!isInsideMain) {
        GeoFenceListener.notifyOutsideBoundary(truckName);
      }
    };

    eventEmitter.on("geofence:status", handleGeoFenceStatus);

    return () => {
      eventEmitter.off("geofence:status", handleGeoFenceStatus);
    };
  }, []);

  return null;
};

export default GeoFenceListener;
