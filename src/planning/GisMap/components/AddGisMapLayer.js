import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DrawingManager } from "@react-google-maps/api";

import { lineString, length } from "@turf/turf";
import round from "lodash/round";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import { setMapState } from "planning/data/planningGis.reducer";
import {
  getCoordinatesFromFeature,
  latLongMapToCoords,
  latLongMapToLineCoords,
} from "utils/map.utils";

const GisEditOptions = {
  clickable: true,
  draggable: true,
  editable: true,
  strokeWeight: 4,
  zIndex: 50,
};

const AddGisMapLayer = ({
  options,
  featureType,
  helpText,
  nextEvent = {},
  validation = false,
}) => {
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
    // apply validation before add coordinates
    let validated = true;
    if (validation) {
      validated = validation(featureCoords);
    }
    if (!validated) return;

    // set coords to form data
    let submitData = {};
    if (featureType === "polyline") {
      submitData.geometry = latLongMapToLineCoords(featureCoords);
      // get length and round to 4 decimals
      submitData.gis_len = round(length(lineString(submitData.geometry)), 4);
    } else if (featureType === "polygon") {
      submitData.geometry = latLongMapToCoords(featureCoords);
    }

    nextEvent.data = {
      ...nextEvent.data,
      ...submitData,
    };
    // clear map refs
    featureRef.current.setMap(null);
    // complete current event -> fire next event
    dispatch(setMapState(nextEvent));
  }, [featureType]);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
    featureRef.current.setMap(null);
  }, []);

  return (
    <>
      <DrawingManager
        options={{
          drawingControl: false,
          polylineOptions: { ...options, ...GisEditOptions },
          polygonOptions: { ...options, ...GisEditOptions },
        }}
        drawingMode={isAdd ? featureType : null}
        onPolylineComplete={handleFeatureCreate}
        onPolygonComplete={handleFeatureCreate}
      />
      <GisMapPopups>
        <Paper>
          <Box
            minWidth="350px"
            maxWidth="550px"
            backgroundColor="secondary.light"
            p={2}
          >
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

export default AddGisMapLayer;
