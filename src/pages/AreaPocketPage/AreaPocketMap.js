import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
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
  onCancel,
}) => {
  const mapRef = useRef();
  const [showSubmit, setShowSubmit] = useState(false);

  const onPolygonComplete = useCallback((polygon) => {
    mapRef.current = polygon;
    onDrawComplete();
    setShowSubmit(true);
  }, []);

  const handleSave = useCallback(() => {
    onSubmit(getCoordinatesFromFeature(mapRef.current));
    setShowSubmit(false);
    mapRef.current.setMap(null);
  }, [mapRef.current]);

  return (
    <Box width="100%" height="100%">
      {editMode === "polygon" ? (
        <div className="gsp-map-details">
          <Paper>
            <Box p={3}>
              <Typography variant="h4">Draw a Polygon</Typography>
            </Box>
            <Button onClick={onCancel}>Cancel</Button>
          </Paper>
        </div>
      ) : null}
      {showSubmit ? (
        <div className="gsp-map-details">
          <Paper>
            <Stack spacing={2}>
              <Box p={3}>
                <Typography variant="h4">
                  Finalise area polygon than add details
                </Typography>
              </Box>
              <Button onClick={handleSave}>Add</Button>
              <Button onClick={onCancel}>Cancel</Button>
            </Stack>
          </Paper>
        </div>
      ) : null}
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
    </Box>
  );
};

export default AreaPocketMap;
