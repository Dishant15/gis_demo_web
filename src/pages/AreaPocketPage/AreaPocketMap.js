import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";
import { getCoordinatesFromFeature } from "utils/map.utils";
import { getFillColor } from "pages/AreaPocketPage/services";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const center = { lat: 23.033863, lng: 72.585022 };

/**
 * Show all polygons of areaList
 * pass clicked area id in onAreaSelect
 * draw editable polygon if editPocket passed
 * pass edited coords on polygon in onEditComplete
 * show polygon draw tool on editMode = "polygon"
 * call onDrawComplete once polygon closed , edit starts
 * call onSubmit with new coords once edit ends
 * call onCancel to cancel add flow
 *
 * Parent
 *  AreaPocketPage
 */
const AreaPocketMap = ({
  areaList,
  onAreaSelect,
  editMode,
  editPocket,
  onEditComplete,
  onDrawComplete,
  onSubmit,
  onCancel,
}) => {
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
    polyRef.current = polygon;
    // show popup to save edited polygon coordinates
  }, []);

  const handleSave = useCallback(() => {
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
          {areaList.map((area) => {
            const { id, path, g_layer } = area;
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
