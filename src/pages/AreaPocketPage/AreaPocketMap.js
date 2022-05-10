import React, { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
  OverlayView,
  Data,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "../../utils/constant";
import { getCoordinatesFromFeature } from "../../utils/map.utils";
import { Box, Button } from "@mui/material";
import { isNull } from "lodash";

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

const AreaPocketMap = ({
  surveyList,
  onAreaSelect,
  editMode,
  onDrawComplete,
  onSubmit,
}) => {
  const mapRef = useRef();
  const [showSubmit, setShowSubmit] = useState(false);

  const onPolygonComplete = (polygon) => {
    mapRef.current = polygon;
    onDrawComplete();
    setShowSubmit(true);
  };

  const handleSave = () => {
    onSubmit(getCoordinatesFromFeature(mapRef.current));
    mapRef.current.setMap(null);
  };

  return (
    <Box width="100%" height="100%">
      <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            // disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false,
          }}
        >
          <DrawingManager
            options={{
              drawingControl: false,
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
            drawingMode={editMode}
            onPolygonComplete={onPolygonComplete}
          />
          {surveyList.map((survey) => {
            const { id, path } = survey;
            return (
              <Polygon
                key={id}
                options={options}
                paths={path}
                onClick={() => {
                  onAreaSelect(id);
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
      {showSubmit ? <Button onClick={handleSave}>Save</Button> : null}
    </Box>
  );
};

export default AreaPocketMap;
