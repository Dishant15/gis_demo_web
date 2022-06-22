import React, { Fragment, useRef, useMemo, useCallback } from "react";

import { Polygon, Marker } from "@react-google-maps/api";
import { Box, Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Map from "components/common/Map";
import EditPolygonLayer from "components/common/Map/EditPolygonLayer";

import { getCoordinatesFromFeature } from "utils/map.utils";

const WorkOrderMap = ({
  areaPocket = null,
  surveyList,
  highlightSurvey,
  onSurveySelect,
  surveyMapEdit,
  editSurveyLoading,
  onEditCancel,
  onEditComplete,
  unitMapEdit,
  editUnitLoading,
  onUnitEditCancel,
  onUnitEditComplete,
  center,
}) => {
  const polyRef = useRef(null);
  const showEdit = !!surveyMapEdit || editSurveyLoading;
  const showUnitEdit = !!unitMapEdit || editUnitLoading;

  const handleEdit = useCallback(() => {
    const newCoords = getCoordinatesFromFeature(polyRef.current);
    onEditComplete({ id: surveyMapEdit.id, coordinates: newCoords });
  }, [onEditComplete, surveyMapEdit]);

  const handleUnitEdit = useCallback(() => {
    const newCoords = {
      latitude: polyRef.current.position.lat(),
      longitude: polyRef.current.position.lng(),
    };
    onUnitEditComplete({ ...unitMapEdit, coordinates: newCoords });
  }, [unitMapEdit]);

  const mayBeEditMarker = useMemo(() => {
    if (!!unitMapEdit) {
      return (
        <Marker
          draggable
          clickable
          onLoad={(marker) => (polyRef.current = marker)}
          position={unitMapEdit.coordinates}
          label="edit"
          zIndex={10}
        />
      );
    }
  }, [unitMapEdit]);

  const mayBeEditPolygon = useMemo(() => {
    if (!!surveyMapEdit) {
      return (
        <EditPolygonLayer
          ref={polyRef}
          coordinates={surveyMapEdit.coordinates}
        />
      );
    }
    return null;
  }, [surveyMapEdit]);

  return (
    <Box width="100%" height="100%">
      {showEdit ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Click and drag marker points to Edit region polygon
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="error" onClick={onEditCancel} size="small">
                Cancel
              </Button>
              {editSurveyLoading ? (
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
      {showUnitEdit ? (
        <div className="reg-map-details">
          <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Drag building marker to edit location
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="error" onClick={onUnitEditCancel} size="small">
                Cancel
              </Button>
              {editUnitLoading ? (
                <Button size="small">Loading ...</Button>
              ) : (
                <Button size="small" onClick={handleUnitEdit}>
                  Update
                </Button>
              )}
            </CardActions>
          </Card>
        </div>
      ) : null}
      <Map center={center}>
        {mayBeEditPolygon}
        {mayBeEditMarker}
        {!!areaPocket ? (
          <Polygon
            options={{
              fillColor: "#51ADAC",
              fillOpacity: 0.2,
              strokeColor: "#51ADAC",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: false,
              draggable: false,
              editable: false,
              geodesic: false,
              zIndex: 1,
            }}
            paths={areaPocket.coordinates}
          />
        ) : null}
        {surveyList.map((survey) => {
          const { id, coordinates, units } = survey;
          const color = id === highlightSurvey ? "red" : "orange";
          return (
            <Fragment key={id}>
              <Polygon
                key={id}
                options={{
                  fillColor: color,
                  fillOpacity: 0.3,
                  strokeColor: color,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  clickable: true,
                  draggable: false,
                  editable: false,
                  geodesic: false,
                  zIndex: 2,
                }}
                paths={coordinates}
                onClick={onSurveySelect(id)}
              />
              {units.map((unit) => {
                const { id, coordinates } = unit;

                return <Marker key={id} position={coordinates} />;
              })}
            </Fragment>
          );
        })}
      </Map>
    </Box>
  );
};

export default WorkOrderMap;
