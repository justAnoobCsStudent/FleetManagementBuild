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
} from "firebase/firestore";
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
          true // isInsideSub is true when entering the sub-geofence
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
          false // isInsideSub is false when exiting the sub-geofence
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
          false // Outside boundary is not related to sub-geofence
        );
      },
    };

    // Helper function to store alarm in Firestore
    const storeAlarm = async (
      truckName,
      message,
      type,
      timestamp,
      isInsideSub
    ) => {
      try {
        // Check for duplicates in the alarms collection
        const alarmsRef = collection(firestore, "alarms");
        const q = query(
          alarmsRef,
          where("truckName", "==", truckName),
          where("message", "==", message),
          where("type", "==", type)
        );
        const querySnapshot = await getDocs(q);

        // If no duplicates found, add the alarm
        if (querySnapshot.empty) {
          await addDoc(alarmsRef, {
            truckName,
            message,
            type,
            timestamp: Timestamp.fromDate(timestamp), // Correct timestamp format for Firestore
            isInsideSub, // Add isInsideSub property
            isRead: false, // New notifications are unread by default
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

    // Listen to global events for geofence-related notifications
    eventEmitter.on("geofence:entry", ({ truckName, geofenceName }) => {
      GeoFenceListener.notifyEntry(truckName, geofenceName);
    });

    eventEmitter.on("geofence:exit", ({ truckName, geofenceName }) => {
      GeoFenceListener.notifyExit(truckName, geofenceName);
    });

    eventEmitter.on("geofence:outside", ({ truckName }) => {
      GeoFenceListener.notifyOutsideBoundary(truckName);
    });

    // Cleanup listeners on unmount
    return () => {
      eventEmitter.off("geofence:entry");
      eventEmitter.off("geofence:exit");
      eventEmitter.off("geofence:outside");
    };
  }, []);

  return null; // Ensure this returns valid JSX or null
};

export default GeoFenceListener;
