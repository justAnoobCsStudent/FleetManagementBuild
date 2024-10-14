import React, { useEffect, useState } from "react";
import L from "leaflet";
import { Polygon } from "react-leaflet";
import { toast } from "react-toastify";

const GeoFence = ({ truckPosition }) => {
  const [isInside, setIsInside] = useState(false);
  const [isOutside, setIsOutside] = useState(false);

  const polyLine = [
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
  ];

  useEffect(() => {
    if (truckPosition) {
      const geoFencePoly = L.polygon(polyLine);
      const truckCoordinates = L.latLng(truckPosition[0], truckPosition[1]);

      const inside = geoFencePoly.getBounds().contains(truckCoordinates);

      if (inside && !isInside && !isOutside) {
        setIsInside(true);
        setIsOutside(false);
      } else if (!inside && isInside) {
        toast.error("Truck is outside the geofence", {
          position: "top-right",
          autoClose: 5000,
        });
        setIsInside(false);
        setIsOutside(true);
      }
    }

    const exitTimer = setTimeout(() => {
      setIsOutside(false);
    }, 5000);

    return () => clearTimeout(exitTimer);
  }, [truckPosition, isInside, isOutside]);

  return <Polygon positions={polyLine} color="blue" fillOpacity={0.5} />;
};

export default GeoFence;
