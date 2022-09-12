import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DrawingManager } from "@react-google-maps/api";
import { lineString, length } from "@turf/turf";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import {
  getCoordinatesFromFeature,
  latLongMapToLineCoords,
} from "utils/map.utils";
import { setMapState } from "planning/data/planningGis.reducer";
import { round } from "lodash";

const AddPolyLineLayer = ({ options, helpText, nextEvent = {} }) => {
  const dispatch = useDispatch();
  const featureRef = useRef();
  // once user adds marker go in edit mode
  const [isAdd, setIsAdd] = useState(true);

  const handleFeatureCreate = useCallback((feature) => {
    featureRef.current = feature;
    setIsAdd(false);
  }, []);

  const handleAddComplete = useCallback(() => {
    const featureCoords = getCoordinatesFromFeature(featureRef.current);
    // set coords to form data
    const coordinates = latLongMapToLineCoords(featureCoords);
    const gis_len = length(lineString(coordinates));

    nextEvent.data = {
      ...nextEvent.data,
      geometry: coordinates,
      // get gis_len
      gis_len: round(gis_len, 4),
    };
    // clear map refs
    featureRef.current.setMap(null);
    // complete current event -> fire next event
    dispatch(setMapState(nextEvent));
  }, []);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
    featureRef.current.setMap(null);
  }, []);

  return (
    <>
      <DrawingManager
        options={{
          drawingControl: false,
          polylineOptions: { ...options, editable: true },
        }}
        drawingMode={isAdd ? "polyline" : null}
        onPolylineComplete={handleFeatureCreate}
      />
      <GisMapPopups>
        <Paper>
          <Box backgroundColor="secondary.light" p={2}>
            <Typography color="background.paper" mb={2} variant="h6">
              {helpText}
            </Typography>
            <Stack spacing={2} direction="row">
              <Button
                sx={{ minWidth: "10em" }}
                disableElevation
                variant="contained"
                disabled={isAdd}
                onClick={handleAddComplete}
              >
                Submit
              </Button>
              <Button
                color="error"
                sx={{ minWidth: "10em" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Paper>
      </GisMapPopups>
    </>
  );
};

export default AddPolyLineLayer;
