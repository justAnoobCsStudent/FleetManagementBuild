import React, { useEffect } from "react";
import { database, onValue } from "@/Firebase";

const Markers = () => {
  const [markers, setMarkers] = useState([]);
  const [truckIds, setTruckIds] = useState([]);

  useEffect(() => {
    const markersRef = ref(database, "gps_data");

    const unsubscribe = onValue(markersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ids = Object.keys(data);

        // Update truck IDs
        setTruckIds(ids);

        // Map GPS data to markers
        const newMarkers = ids
          .map((truckId) => {
            const latestData = data[truckId];
            const latestKey = Object.keys(latestData).pop();
            const truckData = latestData[latestKey];

            if (truckData.latitude && truckData.longitude) {
              return {
                id: truckId,
                position: [truckData.latitude, truckData.longitude],
                name: `${truckId}`,
              };
            }
            return null;
          })
          .filter((marker) => marker !== null);

        setMarkers(newMarkers);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  return markers;
};

export default Markers;
