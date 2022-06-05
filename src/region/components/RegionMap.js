import React, { useCallback, useMemo, useRef, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";
import { getCoordinatesFromFeature, getFillColor } from "utils/map.utils";

const containerStyle = {
  width: "100%",
  height: "100%",
};

/**
 * Show all polygons of areaList
 * pass clicked area id in onAreaSelect
 * draw editable polygon if editAreaPocket passed
 * pass edited coords on polygon in onEditComplete
 * show polygon draw tool on editMode = "polygon"
 * call onDrawComplete once polygon closed , edit starts
 * call onSubmit with new coords once edit ends
 * call onCancel to cancel add flow
 *
 * Parent
 *  AreaPocketPage
 */
const RegionMap = ({
  areaList,
  mapCenter,
  onAreaSelect,
  editMode,
  editAreaPocket,
  editAreaLoading,
  onEditComplete,
  onDrawComplete,
  onSubmit,
  onCancel,
}) => {
  const polyRef = useRef();
  const [showSubmit, setShowSubmit] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const onPolygonComplete = useCallback(
    (polygon) => {
      polyRef.current = polygon;
      onDrawComplete();
      setShowSubmit(true);
    },
    [onDrawComplete]
  );

  const handleSave = useCallback(() => {
    onSubmit(getCoordinatesFromFeature(polyRef.current));
    setShowSubmit(false);
    polyRef.current.setMap(null);
  }, [onSubmit]);

  const handleEditPocketLoad = useCallback((polygon) => {
    polyRef.current = polygon;
    // show popup to save edited polygon coordinates
    setShowEdit(true);
  }, []);

  const handleEdit = useCallback(() => {
    const newCoords = getCoordinatesFromFeature(polyRef.current);
    onEditComplete({ ...editAreaPocket, coordinates: newCoords });
    setShowEdit(false);
  }, [onEditComplete, editAreaPocket]);

  const handleEditCancel = useCallback(() => {
    setShowEdit(false);
    onCancel();
  }, [onCancel]);

  const mayBeEditPolygon = useMemo(() => {
    if (!!editAreaPocket) {
      return (
        <Polygon
          options={{
            fillColor: "orange",
            fillOpacity: 0.3,
            strokeColor: "orange",
            strokeOpacity: 1,
            strokeWeight: 2,
            clickable: false,
            draggable: true,
            editable: true,
            geodesic: false,
            zIndex: 5,
          }}
          onLoad={handleEditPocketLoad}
          paths={editAreaPocket.coordinates}
          onClick={() => {
            onAreaSelect(editAreaPocket.id);
          }}
        />
      );
    }
    return null;
  }, [editAreaPocket, handleEditPocketLoad, onAreaSelect]);

  return (
    <Box width="100%" height="100%">
      {editMode === "polygon" ? (
        <div className="reg-map-details">
          <Paper>
            <Box p={3}>
              <Typography variant="h4">Draw a Polygon</Typography>
            </Box>
            <Button onClick={onCancel}>Cancel</Button>
          </Paper>
        </div>
      ) : null}
      {showSubmit ? (
        <div className="reg-map-details">
          <Paper>
            <Stack spacing={2}>
              <Box p={3}>
                <Typography variant="h4">
                  Finalise region polygon than add details
                </Typography>
              </Box>
              <Button onClick={handleSave}>Add</Button>
            </Stack>
          </Paper>
        </div>
      ) : null}
      {showEdit || editAreaLoading ? (
        <div className="reg-map-details">
          <Paper>
            <Stack spacing={2}>
              <Box p={3}>
                <Typography variant="h4">
                  Click and drag marker points to Edit area polygon
                </Typography>
              </Box>
              <Button onClick={handleEditCancel}>Cancel</Button>
              {editAreaLoading ? (
                <Button>Loading ...</Button>
              ) : (
                <Button onClick={handleEdit}>Update</Button>
              )}
            </Stack>
          </Paper>
        </div>
      ) : null}
      <LoadScript libraries={MAP_LIBRARIES} googleMapsApiKey={GOOGLE_MAP_KEY}>
        <GoogleMap
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          options={{
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

          {mayBeEditPolygon}
          {areaList.map((area) => {
            const { id, coordinates, layer } = area;
            const color = getFillColor(layer);
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
                paths={coordinates}
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

export default RegionMap;
