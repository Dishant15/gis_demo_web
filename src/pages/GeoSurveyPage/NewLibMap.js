import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Polygon,
} from "@react-google-maps/api";

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

const polyGonPath = [
  {
    lat: 25.339061458818374,
    lng: 141.49154663085938,
  },
  {
    lat: 25.81472706309741,
    lng: 174.01107788085938,
  },
  {
    lat: 3.1789097955033068,
    lng: 152.21420288085938,
  },
];

const options = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: true,
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
  const [isEditable, setEditable] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <>
      {/* <button onClick={() => setEditable((curr) => !curr)}>Set editable</button> */}
      <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={3}>
          <Polyline
            onLoad={onLoad}
            path={path}
            options={options}
            editable={isEditable}
            onClick={(e) => {
              setEditable((curr) => !curr);
              console.log(
                "🚀 ~ file: NewLibMap.js ~ line 65 ~ AreaPocketMap ~ e",
                e
              );
            }}
          />
          <Polygon path={polyGonPath} />
        </GoogleMap>
      </LoadScript>
    </>
  );
}

export default React.memo(AreaPocketMap);
