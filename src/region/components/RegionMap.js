import React, { useCallback, useMemo, useRef, useState } from "react";

import { Polygon, DrawingManager } from "@react-google-maps/api";
import { Box, Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import EditPolygonLayer from "components/common/Map/EditPolygonLayer";

import { getCoordinatesFromFeature, getFillColor } from "utils/map.utils";
import Map from "components/common/Map";

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
  const showEdit = !!editRegionPocket || editRegionLoading;

  const onPolygonComplete = useCallback(
    (polygon) => {
      polyRef.current = polygon;
      onDrawComplete();
      setShowSubmit(true);
    },
    [onDrawComplete]
  );

  const handleCreateCancel = useCallback(() => {
    setShowSubmit(false);
    polyRef.current.setMap(null);
    onCancel();
  }, [onCancel]);

  const handleSave = useCallback(() => {
    onSubmit(getCoordinatesFromFeature(polyRef.current));
    setShowSubmit(false);
    polyRef.current.setMap(null);
  }, [onSubmit]);

  const handleEdit = useCallback(() => {
    const newCoords = getCoordinatesFromFeature(polyRef.current);
    onEditComplete({ ...editRegionPocket, coordinates: newCoords });
  }, [onEditComplete, editRegionPocket]);

  const handleEditCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const mayBeEditPolygon = useMemo(() => {
    if (!!editRegionPocket) {
      return (
        <EditPolygonLayer
          ref={polyRef}
          coordinates={editRegionPocket.coordinates}
        />
      );
    }
    return null;
  }, [editRegionPocket]);

  return (
    <Box width="100%" height="100%">
      {editMode === "polygon" ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Draw a Polygon
              </Typography>
              <Typography variant="body2">
                Click on the map to place points of the polygon
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                disableElevation
                color="error"
                onClick={onCancel}
                size="small"
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        </div>
      ) : null}
      {showSubmit ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Finalise region polygon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click and drag points on polygon edges to fine tune polygon
                shape
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                disableElevation
                color="error"
                onClick={handleCreateCancel}
                size="small"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSave}
                size="small"
              >
                Complete
              </Button>
            </CardActions>
          </Card>
        </div>
      ) : null}
      {showEdit ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Click and drag marker points to Edit region polygon
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                disableElevation
                color="error"
                onClick={handleEditCancel}
                size="small"
              >
                Cancel
              </Button>
              {editRegionLoading ? (
                <Button variant="contained" disableElevation size="small">
                  Loading ...
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  onClick={handleEdit}
                >
                  Update
                </Button>
              )}
            </CardActions>
          </Card>
        </div>
      ) : null}
      <Map center={mapCenter}>
        <DrawingManager
          options={{
            drawingControl: false,
            polygonOptions: {
              fillColor: "lightblue",
              fillOpacity: 0.5,
              strokeColor: "blue",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: true,
              draggable: true,
              editable: true,
              geodesic: false,
              zIndex: 10,
            },
          }}
          drawingMode={editMode}
          onPolygonComplete={onPolygonComplete}
        />

        {mayBeEditPolygon}
        {regionList.map((reg) => {
          const { id, coordinates, layer } = reg;
          const color = getFillColor(layer);

          const multiPolygons = coordinates.map((polyCoord, ind) => {
            return (
              <Polygon
                key={ind}
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
                  zIndex: layer,
                }}
                paths={polyCoord}
                onClick={() => {
                  onRegionSelect(id);
                }}
              />
            );
          });

          return <React.Fragment key={id}>{multiPolygons}</React.Fragment>;
        })}
      </Map>
    </Box>
  );
};

export default RegionMap;
