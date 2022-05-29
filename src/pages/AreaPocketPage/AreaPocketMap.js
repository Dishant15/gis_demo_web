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
import { getFillColor } from "./services";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = { lat: 23.033863, lng: 72.585022 };

const AreaPocketMap = ({
  surveyList,
  onAreaSelect,
  editMode,
  editPocket,
  onDrawComplete,
  onSubmit,
  onCancel,
}) => {
  console.log("🚀 ~ file: AreaPocketMap.js ~ line 29 ~ editPocket", editPocket);
  const polyRef = useRef();
  const mapRef = useRef();
  const [showSubmit, setShowSubmit] = useState(false);

  const onPolygonComplete = useCallback(
    (polygon) => {
      polyRef.current = polygon;
      onDrawComplete();
      setShowSubmit(true);
    },
    [onDrawComplete]
  );

  const handleEditPocketLoad = useCallback((polygon) => {
    console.log(
      "🚀 ~ file: AreaPocketMap.js ~ line 44 ~ handleEditPocketLoad ~ polygon",
      polygon
    );
    polyRef.current = polygon;
    setShowSubmit(true);
  }, []);

  const handleSave = useCallback(() => {
    console.log(
      "🚀 ~ file: AreaPocketMap.js ~ line 45 ~ handleSave ~ getCoordinatesFromFeature(polyRef.current)",
      getCoordinatesFromFeature(polyRef.current)
    );
    return;
    onSubmit(getCoordinatesFromFeature(polyRef.current));
    setShowSubmit(false);
    polyRef.current.setMap(null);
  }, [polyRef.current, onSubmit]);

  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
    },
    [mapRef.current]
  );

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
            </Stack>
          </Paper>
        </div>
      ) : null}
      <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          center={center}
          onLoad={handleMapLoad}
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
          {!!editPocket ? (
            <Polygon
              options={{
                fillColor: "orange",
                fillOpacity: 0.3,
                strokeColor: "orange",
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: true,
                geodesic: false,
                zIndex: 5,
              }}
              onLoad={handleEditPocketLoad}
              paths={editPocket.path}
              onClick={() => {
                onAreaSelect(editPocket.id);
              }}
            />
          ) : null}
          {surveyList.map((survey) => {
            const { id, path, g_layer } = survey;
            const color = getFillColor(g_layer);
            return (
              <Polygon
                key={id}
                options={{
                  fillColor: color,
                  fillOpacity: 0.3,
                  strokeColor: color,
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: true,
                  draggable: false,
                  editable: false,
                  geodesic: false,
                  zIndex: 1,
                }}
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
