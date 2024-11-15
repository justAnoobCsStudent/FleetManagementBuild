import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoFence from "./GeoFence";

// Truck icon URL
const truckIconUrl = "/src/assets/truck.png"; // Replace with your desired truck icon

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40], // Adjust size to fit your needs
  iconAnchor: [20, 40], // Anchor point for the icon (bottom-center)
  popupAnchor: [0, -40], // Position of the popup relative to the icon
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41], // Adjust shadow size
});

// Custom hook to adjust the map view dynamically
const AdjustMapView = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 1) {
      // If only one marker, zoom to the marker
      map.setView(markers[0].position, 15);
    } else if (markers.length > 1) {
      // If multiple markers, fit bounds to include all markers
      const bounds = L.latLngBounds(markers.map((marker) => marker.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
};

const Map = ({ markers }) => {
  return (
    <div className="relative h-full w-full" style={{ zIndex: 0 }}>
      <MapContainer
        center={[0, 0]} // Center is dynamically adjusted using AdjustMapView
        zoom={13} // Default zoom level
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        {/* Default TileLayer for Leaflet */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render GeoFence dynamically for each marker */}
        {markers.map((marker) => (
          <GeoFence
            key={marker.id} // Use marker ID as the key
            truckPosition={marker.position}
            truckName={marker.name}
          />
        ))}

        {/* Render markers dynamically */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={truckIcon}>
            <Popup>
              <div>
                <h3 className="font-semibold">{marker.name}</h3>
                <p>
                  <strong>Location:</strong> {marker.position.join(", ")}
                </p>
                <p>
                  <strong>Status:</strong> {marker.status || "N/A"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Adjust map view based on markers */}
        <AdjustMapView markers={markers} />
      </MapContainer>
    </div>
  );
};

// Default Props for Map
Map.defaultProps = {
  markers: [],
};

export default Map;
