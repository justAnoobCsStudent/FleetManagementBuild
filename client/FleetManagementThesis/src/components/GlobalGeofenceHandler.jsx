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

const GlobalGeofenceHandler = () => {
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
          formattedTimestamp,
          true,
          "enter"
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
          formattedTimestamp,
          false,
          "exit"
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
          formattedTimestamp,
          false,
          "outbounds"
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

            // Get the latest "exit" timestamp from the alarms collection
            const alarmsRef = collection(firestore, "alarms");
            const alarmQuery = query(
              alarmsRef,
              where("truckName", "==", truckName),
              where("status", "==", "exit")
            );
            const alarmSnapshot = await getDocs(alarmQuery);

            if (!alarmSnapshot.empty) {
              const latestAlarm = alarmSnapshot.docs
                .map((doc) => doc.data())
                .sort(
                  (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                )[0]; // Sort by timestamp descending

              const latestTimestamp = latestAlarm.timestamp; // Latest exit timestamp in the alarms collection
              const currentTimestamp = new Date(); // Current timestamp
              const latestDate = new Date(latestTimestamp);

              // Format timestamps as ISO strings
              const startTime = latestDate.toISOString();

              // Get distance values from the distances collection
              const distancesRef = collection(firestore, "distances");
              const distancesQuery = query(
                distancesRef,
                where("truckName", "==", truckName),
                where("timestamp", ">=", startTime)
              );
              const distancesSnapshot = await getDocs(distancesQuery);

              if (!distancesSnapshot.empty) {
                // Extract distance values
                const distanceValues = distancesSnapshot.docs.map(
                  (doc) => doc.data().distance
                );

                // Calculate average distance
                const totalDistance = distanceValues.reduce(
                  (sum, value) => sum + value,
                  0
                );
                const averageDistance =
                  distanceValues.length > 0
                    ? totalDistance / distanceValues.length
                    : 0;

                // Calculate time traveled in seconds
                const timeTravelled = Math.abs(currentTimestamp - latestDate);
                const timeTravelledInSeconds = Math.floor(timeTravelled / 1000);

                // Call the API with vehicleId, timeTravelled, and averageDistance as parameters
                await axios.post(
                  `http://localhost:7000/api/v1/reports/vehicle/`,
                  {
                    vehicleId: docId,
                    timeTravelled: timeTravelledInSeconds,
                    averageDistance: averageDistance.toFixed(2), // Include the average distance
                  }
                );

                console.log(
                  `Report generated for ${truckName} with timeTravelled: ${timeTravelledInSeconds} seconds and averageDistance: ${averageDistance.toFixed(
                    2
                  )} km`
                );
              } else {
                console.warn(
                  `No distance data found for ${truckName} in the specified time range.`
                );
              }
            } else {
              console.warn(
                `No recent "exit" status found for ${truckName} in alarms collection.`
              );
            }
          } else {
            console.warn(`${truckName} was not found in vehicles collection.`);
          }
        } catch (error) {
          console.error("Error generating vehicle report:", error);
        }
      },
    };

    const storeAlarm = async (
      truckName,
      message,
      type,
      timestamp,
      isInsideSub,
      status
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
            timestamp: timestamp,
            isInsideSub,
            isRead: false,
            status,
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

    const handleDistanceStatus = async ({ truckId, distance }) => {
      try {
        const distancesRef = collection(firestore, "distances");
        const currentTime = new Date();
        const formattedTimestamp = currentTime.toISOString();

        // Set a new document with truck ID, distance, and timestamp
        await addDoc(distancesRef, {
          truckName: truckId, // Truck ID
          distance: distance, // Distance in kilometers
          timestamp: formattedTimestamp, // Timestamp of the entry
        });

        console.log(
          `Distance for ${truckId} set to Firestore: ${distance.toFixed(2)} km`
        );
      } catch (error) {
        console.error(`Error setting distance for ${truckId}:`, error);
      }
    };

    const handleFuelStatus = async ({ truckId, fuel_percentage, message }) => {
      const currentTime = new Date();
      const formattedTimestamp = currentTime.toLocaleString();

      const docRef = await addDoc(collection(firestore, "alarms"), {
        truckname: truckId,
        timestamp: formattedTimestamp,
        fuel_percentage: fuel_percentage,
        message: message,
        type: "Fuel Theft",
        isRead: false, // New isRead property
      });
    };

    eventEmitter.on("geofence:status", handleGeoFenceStatus);
    eventEmitter.on("distance:status", handleDistanceStatus);
    eventEmitter.on("fuel:status", handleFuelStatus);

    return () => {
      eventEmitter.off("geofence:status", handleGeoFenceStatus);
      eventEmitter.off("distance:status", handleDistanceStatus);
      eventEmitter.off("fuel:status", handleFuelStatus);
    };
  }, []);

  return null;
};

export default GlobalGeofenceHandler;
