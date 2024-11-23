import React from "react";
import { Polygon } from "react-leaflet";

const GeoFence = () => {
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

  const subGeofence1 = {
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

  const subGeofence2 = {
    name: "SM Bacoor",
    coordinates: [
      [14.445911648200168, 120.94983960677226],
      [14.443947999766197, 120.94944263985393],
      [14.443625918209483, 120.95104123636285],
      [14.444394757282462, 120.9512343554042],
      [14.444322029375842, 120.9518029836926],
      [14.445475283379661, 120.95202828924086],
    ],
    color: "green",
    fillOpacity: 0.4,
  };

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
        positions={subGeofence1.coordinates}
        color={subGeofence1.color}
        fillColor={subGeofence1.color}
        fillOpacity={subGeofence1.fillOpacity}
      />
      <Polygon
        positions={subGeofence2.coordinates}
        color={subGeofence2.color}
        fillColor={subGeofence2.color}
        fillOpacity={subGeofence2.fillOpacity}
      />
    </>
  );
};

export default GeoFence;
