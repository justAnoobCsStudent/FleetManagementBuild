import L from "leaflet";
import { eventEmitter } from "../utils/eventEmitter";

// Define geofence boundaries
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
};

const subGeofence1 = {
  name: "Daniellah's Junkshop",
  coordinates: [
    [14.317552082430042, 120.8611809242526],
    [14.317546884630769, 120.85873474967067],
    [14.316980323788703, 120.85868646990919],
    [14.317037499718372, 120.86127748377558],
  ],
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
};

// Initialize Leaflet polygons
const mainGeofencePoly = L.polygon(mainGeofence.coordinates);
const subGeofence1Poly = L.polygon(subGeofence1.coordinates);
const subGeofence2Poly = L.polygon(subGeofence2.coordinates);

const checkGeofenceStatus = (truckPosition, truckName) => {
  const truckCoordinates = L.latLng(truckPosition[0], truckPosition[1]);

  const isInsideMain = mainGeofencePoly.getBounds().contains(truckCoordinates);
  const isInsideSub1 = subGeofence1Poly.getBounds().contains(truckCoordinates);
  const isInsideSub2 = subGeofence2Poly.getBounds().contains(truckCoordinates);

  // Determine which geofence the truck is in
  let geofenceName = "Outside All Geofences";
  if (isInsideSub1 && !isInsideSub2 && isInsideMain) {
    geofenceName = subGeofence1.name;
  } else if (!isInsideSub1 && isInsideSub2 && isInsideMain) {
    geofenceName = subGeofence2.name;
  } else if (isInsideMain) {
    geofenceName = mainGeofence.name;
  }

  // Emit geofence status event
  eventEmitter.emit("geofence:status", {
    truckName,
    isInsideSub1,
    isInsideSub2,
    isInsideMain,
    geofenceName,
  });
};

export default checkGeofenceStatus;
