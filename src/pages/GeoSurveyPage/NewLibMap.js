import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";

import { GOOGLE_MAP_KEY } from "../../utils/constant";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = {
  lat: 0,
  lng: -180,
};

const onLoad = (polyline) => {
  console.log("polyline: ", polyline.paths);
};

const path = [
  { lat: 37.772, lng: -122.214 },
  { lat: 21.291, lng: -157.821 },
  { lat: -18.142, lng: 178.431 },
  { lat: -27.467, lng: 153.027 },
];

const options = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  paths: [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 },
  ],
  zIndex: 1,
};

function AreaPocketMap() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        {isMounted && <Polyline onLoad={onLoad} options={options} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(AreaPocketMap);
