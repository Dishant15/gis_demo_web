import React, { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Data,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "../../utils/constant";
import { getCoordinatesFromFeature } from "../../utils/map.utils";

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
  editable: true,
  geodesic: false,
  zIndex: 1,
};

export default function CreateAreaPocket() {
  const [drawingMode, setDrawingMode] = useState("polygon");
  const mapRef = useRef();

  const onLoad = (drawingManager) => {
    console.log(drawingManager);
    mapRef.current = drawingManager.getMap();
  };

  const onPolygonComplete = (polygon) => {
    mapRef.current = polygon;
    setDrawingMode(null);
  };

  const handleSave = () => {
    console.log(
      "🚀 ~ file: CreateAreaPocket.js ~ line 57 ~ handleSave ~ handleSave",
      getCoordinatesFromFeature(mapRef.current)
    );
  };

  return (
    <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
      <GoogleMap
        clickableIcons={false}
        onClick={handleSave}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Data
          options={{
            controls: null,
          }}
        />
        <DrawingManager
          options={{
            polygonOptions: options,
          }}
          drawingMode={drawingMode}
          onLoad={onLoad}
          onPolygonComplete={onPolygonComplete}
        />
      </GoogleMap>
    </LoadScript>
  );
}
