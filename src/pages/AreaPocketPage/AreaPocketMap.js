import React from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

import { GOOGLE_MAP_KEY } from "../../utils/constant";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = { lat: 23.033863, lng: 72.585022 };

const options = {
  fillColor: "lightblue",
  fillOpacity: 0.5,
  strokeColor: "orange",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

function AreaPocketMap({ surveyList }) {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
      <GoogleMap
        clickableIcons={false}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {surveyList.map((survey) => {
          const { id, path } = survey;
          return <Polygon key={id} options={options} paths={path} />;
        })}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(AreaPocketMap);
