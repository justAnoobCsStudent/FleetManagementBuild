import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom hook to set the map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const Map = ({ markers, center, zoom }) => {
  return (
    <div className="h-full">
      <MapContainer
        // Map Container Properties
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Default TileLayer for Leaflet */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}

        {/* Automatically adjust the view based on the first marker, if available */}
        {markers.length > 0 && (
          <ChangeView center={markers[0].position} zoom={zoom} />
        )}
      </MapContainer>
    </div>
  );
};

// Default Marker View
Map.defaultProps = {
  center: [14.31860301338563, 120.86070267301378], // Default map center
  zoom: 13, // Default zoom level
  markers: [], // Default empty array for markers
};

export default Map;
