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
  center,
}) => {
  const polyRef = useRef(null);
  const showEdit = !!surveyMapEdit || editSurveyLoading;

  const handleEdit = useCallback(() => {
    const newCoords = getCoordinatesFromFeature(polyRef.current);
    onEditComplete({ id: surveyMapEdit.id, coordinates: newCoords });
  }, [onEditComplete, surveyMapEdit]);

  const handleEditCancel = useCallback(() => {
    onEditCancel();
  }, [onEditCancel]);

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
              <Button color="error" onClick={handleEditCancel} size="small">
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
      <Map center={center}>
        {mayBeEditPolygon}
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
                return <Marker key={unit.id} position={unit.coordinates} />;
              })}
            </Fragment>
          );
        })}
      </Map>
    </Box>
  );
};

export default WorkOrderMap;
