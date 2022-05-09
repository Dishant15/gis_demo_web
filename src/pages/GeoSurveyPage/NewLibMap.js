import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

import { GOOGLE_MAP_KEY } from "../../utils/constant";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = { lat: 23.033863, lng: 72.585022 };

const options = {
  fillColor: "lightblue",
  fillOpacity: 1,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const testpath = [
  {
    lat: 72.51221179962158,
    lng: 23.03870536238185,
  },
  {
    lat: 72.51540899276732,
    lng: 23.04486604308907,
  },
  {
    lat: 72.5159078836441,
    lng: 23.04610011993259,
  },
  {
    lat: 72.51736164093018,
    lng: 23.044964769652672,
  },
  {
    lat: 72.51782834529875,
    lng: 23.04448100879958,
  },
  {
    lat: 72.52025842666626,
    lng: 23.043562845667385,
  },
  {
    lat: 72.51706123352051,
    lng: 23.038132720697696,
  },
  {
    lat: 72.51638531684877,
    lng: 23.036888697617638,
  },
  {
    lat: 72.51530170440674,
    lng: 23.03732311968093,
  },
  {
    lat: 72.51221179962158,
    lng: 23.03870536238185,
  },
];

function AreaPocketMap({ surveyList }) {
  console.log(
    "🚀 ~ file: NewLibMap.js ~ line 67 ~ AreaPocketMap ~ surveyList",
    surveyList
  );
  const [isEditable, setEditable] = useState(false);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <Polygon options={options} paths={testpath} />
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(AreaPocketMap);
