import React, { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
  OverlayView,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "../../utils/constant";
import { getCoordinatesFromFeature } from "../../utils/map.utils";
import { Box, Button } from "@mui/material";

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
  clickable: true,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

function AreaPocketMap({ surveyList, editMode, onEditComplete }) {
  const [drawingMode, setDrawingMode] = useState("polygon");
  const mapRef = useRef();

  const onLoad = (drawingManager) => {
    console.log(drawingManager);
    mapRef.current = drawingManager.getMap();
  };

  const onPolygonComplete = (polygon) => {
    mapRef.current = polygon;
    setDrawingMode(null);
    onEditComplete();
    // other option is to save polygon to a state and remove new drawn
    // if(destroy) {
    //   polygon.setMap(null);
    // }
  };

  const handleSave = () => {
    console.log(
      "🚀 ~ file: CreateAreaPocket.js ~ line 57 ~ handleSave ~ handleSave",
      getCoordinatesFromFeature(mapRef.current)
    );
  };

  return (
    <Box width="100%" height="100%">
      <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          {editMode ? (
            <DrawingManager
              options={{
                polygonOptions: {
                  fillColor: "lightblue",
                  fillOpacity: 0.5,
                  strokeColor: "blue",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: false,
                  draggable: false,
                  editable: true,
                  geodesic: false,
                  zIndex: 1,
                },
              }}
              drawingMode={drawingMode}
              onLoad={onLoad}
              onPolygonComplete={onPolygonComplete}
            />
          ) : null}
          {surveyList.map((survey) => {
            const { id, path } = survey;
            return (
              <Polygon
                key={id}
                options={options}
                paths={path}
                onClick={() => {
                  console.log(id);
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
      <Button onClick={handleSave}>Save</Button>
    </Box>
  );
}

export default React.memo(AreaPocketMap);
