import React, { useCallback, useMemo, useRef, useState } from "react";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  DrawingManager,
} from "@react-google-maps/api";

import { GOOGLE_MAP_KEY, MAP_LIBRARIES } from "utils/constant";
import { getCoordinatesFromFeature, getFillColor } from "utils/map.utils";
import Add from "@mui/icons-material/Add";

const containerStyle = {
  width: "100%",
  height: "100%",
};

/**
 * Show all polygons of regionList
 * pass clicked region id in onRegionSelect
 * draw editable polygon if editRegionPocket passed
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
  regionList,
  mapCenter,
  onRegionSelect,
  editMode,
  editRegionPocket,
  editRegionLoading,
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
    onEditComplete({ ...editRegionPocket, coordinates: newCoords });
    setShowEdit(false);
  }, [onEditComplete, editRegionPocket]);

  const handleEditCancel = useCallback(() => {
    setShowEdit(false);
    onCancel();
  }, [onCancel]);

  const mayBeEditPolygon = useMemo(() => {
    if (!!editRegionPocket) {
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
          paths={editRegionPocket.coordinates}
          onClick={() => {
            onRegionSelect(editRegionPocket.id);
          }}
        />
      );
    }
    return null;
  }, [editRegionPocket, handleEditPocketLoad, onRegionSelect]);

  return (
    <Box width="100%" height="100%">
      {editMode === "polygon" ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Draw a Polygon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on the map to place points of the polygon
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="error" onClick={onCancel} size="small">
                Cancel
              </Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
      ) : null}
      {showSubmit ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Finalise region polygon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click and drag points on polygon edges to fine tune polygon
                shape
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={handleSave} size="small">
                Complete
              </Button>
            </CardActions>
          </Card>
        </div>
      ) : null}
      {showEdit || editRegionLoading ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Click and drag marker points to Edit region polygon
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="error" onClick={handleEditCancel} size="small">
                Cancel
              </Button>
              {editRegionLoading ? (
                <Button size="small">Loading ...</Button>
              ) : (
                <Button size="small" onClick={handleEdit}>
                  Update
                </Button>
              )}
            </CardActions>
          </Card>
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
          {regionList.map((area) => {
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
                  onRegionSelect(id);
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
