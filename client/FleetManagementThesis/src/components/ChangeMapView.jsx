import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

export default ChangeMapView;
