import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DrawingManager } from "@react-google-maps/api";

import { lineString, length } from "@turf/turf";
import round from "lodash/round";
import get from "lodash/get";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import GisMapPopups from "./GisMapPopups";

import { setMapState } from "planning/data/planningGis.reducer";
import {
  getCoordinatesFromFeature,
  getMarkerCoordinatesFromFeature,
  latLongMapToCoords,
  latLongMapToLineCoords,
} from "utils/map.utils";
import {
  FEATURE_TYPES,
  MAP_DRAWING_MODE,
  zIndexMapping,
} from "../layers/common/configuration";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import { getLayerSelectedConfiguration } from "planning/data/planningState.selectors";

const GisEditOptions = {
  clickable: true,
  draggable: true,
  editable: true,
  strokeWeight: 4,
  zIndex: zIndexMapping.edit,
};

const GisMarkerEditOptions = {
  clickable: true,
  draggable: true,
  editable: true,
  geodesic: false,
  zIndex: zIndexMapping.edit,
};

const AddGisMapLayer = ({ validation = false, layerKey }) => {
  const dispatch = useDispatch();
  const featureRef = useRef();
  // once user adds marker go in edit mode
  const [isAdd, setIsAdd] = useState(true);

  // layer key based data default data from utils -> LayerKeyMappings
  const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);
  const configuration = useSelector(getLayerSelectedConfiguration(layerKey));
  const options = get(LayerKeyMappings, [layerKey, "getViewOptions"])(
    configuration
  );
  const initialData = get(LayerKeyMappings, [layerKey, "initialElementData"]);

  /**************************** */
  //        Handlers            //
  /**************************** */
  const handleFeatureCreate = useCallback((feature) => {
    featureRef.current = feature;
    setIsAdd(false);
  }, []);

  const handleAddComplete = useCallback(() => {
    const featureCoords =
      featureType === FEATURE_TYPES.POINT
        ? getMarkerCoordinatesFromFeature(featureRef.current)
        : getCoordinatesFromFeature(featureRef.current);
    // apply validation before add coordinates
    let validated = true;
    if (validation) {
      validated = validation(featureCoords);
    }
    if (!validated) return;

    // set coords to form data
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      submitData.geometry = latLongMapToLineCoords(featureCoords);
      // get length and round to 4 decimals
      submitData.gis_len = round(length(lineString(submitData.geometry)), 4);
    } else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData.geometry = latLongMapToCoords(featureCoords);
    } else if (featureType === FEATURE_TYPES.POINT) {
      submitData.geometry = latLongMapToCoords([featureCoords])[0];
    } else {
      throw new Error("feature type is invalid");
    }
    // clear map refs
    featureRef.current.setMap(null);
    // complete current event -> fire next event
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementForm, // event for "layerForm"
        layerKey,
        data: { ...initialData, ...submitData }, // init data
      })
    );
  }, [featureType]);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
    featureRef.current.setMap(null);
  }, []);

  // helpText show in popup based on featureType
  const helpText = useMemo(() => {
    switch (featureType) {
      case FEATURE_TYPES.POLYLINE:
        return "Click on map to create line on map. Double click to complete.";
      case FEATURE_TYPES.POLYGON:
        return "Click on map to place area points on map. Complete polygon and adjust points.";
      case FEATURE_TYPES.POINT:
        return "Click on map to add new location";
      default:
        return "";
    }
  }, [featureType]);

  return (
    <>
      <DrawingManager
        options={{
          drawingControl: false,
          polylineOptions: { ...options, ...GisEditOptions },
          polygonOptions: { ...options, ...GisEditOptions },
          markerOptions: {
            ...options,
            ...GisMarkerEditOptions,
            icon: options?.pin,
          },
        }}
        drawingMode={isAdd ? MAP_DRAWING_MODE[featureType] : null}
        onPolylineComplete={handleFeatureCreate}
        onPolygonComplete={handleFeatureCreate}
        onMarkerComplete={handleFeatureCreate}
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
