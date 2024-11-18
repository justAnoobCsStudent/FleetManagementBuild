import React, { useEffect } from "react";
import L from "leaflet";
import { Polygon } from "react-leaflet";
import { eventEmitter } from "../utils/eventEmitter";

const GeoFence = ({ truckPosition, truckName }) => {
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

  useEffect(() => {
    if (truckPosition) {
      const mainGeoFencePoly = L.polygon(mainGeofence.coordinates);
      const subGeoFencePoly = L.polygon(subGeofence.coordinates);
      const truckCoordinates = L.latLng(truckPosition[0], truckPosition[1]);

      const isInsideMain = mainGeoFencePoly
        .getBounds()
        .contains(truckCoordinates);
      const isInsideSub = subGeoFencePoly
        .getBounds()
        .contains(truckCoordinates);

      // Correctly determine the geofence name
      let geofenceName = "Outside All Geofences";
      if (isInsideSub) {
        geofenceName = subGeofence.name;
      } else if (isInsideMain) {
        geofenceName = subGeofence.name;
      }

      // Emit status with accurate geofence name
      eventEmitter.emit("geofence:status", {
        truckName,
        isInsideSub,
        isInsideMain,
        geofenceName,
      });
    }
  }, [truckPosition, truckName]);

  return (
    <>
      <Polygon
        positions={mainGeofence.coordinates}
        color={mainGeofence.color}
        fillColor={mainGeofence.color}
        fillOpacity={mainGeofence.fillOpacity}
        opacity={mainGeofence.outlineOpacity}
      />
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
