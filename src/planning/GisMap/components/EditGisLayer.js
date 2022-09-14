import React, { useCallback, useMemo, useRef } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Marker, Polyline } from "@react-google-maps/api";

import get from "lodash/get";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GisMapPopups from "./GisMapPopups";

import {
  coordsToLatLongMap,
  getCoordinatesFromFeature,
  getMarkerCoordinatesFromFeature,
  latLongMapToCoords,
  latLongMapToLineCoords,
} from "utils/map.utils";
import { editElementDetails } from "planning/data/layer.services";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import { addNotification } from "redux/reducers/notification.reducer";
import { setMapState } from "planning/data/planningGis.reducer";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { PLANNING_EVENT } from "../utils";

const EditGisLayer = ({
  icon,
  helpText,
  layerKey,
  featureType, // marker | polyline
  options = {},
  nextEvent = {},
}) => {
  const dispatch = useDispatch();
  const featureRef = useRef();
  const { elementId, coordinates } = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const onSuccessHandler = () => {
    dispatch(
      addNotification({
        type: "success",
        title: "Element location updated Successfully",
      })
    );
    // refetch layer
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      })
    );
    // clear map refs
    featureRef.current.setMap(null);
    // complete current event -> fire next event OR go to details by default
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: { elementId },
        ...nextEvent,
      })
    );
  };

  const onErrorHandler = (err) => {
    console.log(
      "🚀 ~ file: EditGisLayer.js ~ line 46 ~ onErrorHandler ~ err",
      err
    );
    const errStatus = get(err, "response.status");
    let notiText;
    if (errStatus === 400) {
      // handle bad data
      let errData = get(err, "response.data");
      for (const fieldKey in errData) {
        if (Object.hasOwnProperty.call(errData, fieldKey)) {
          const errList = errData[fieldKey];
          notiText = get(errList, "0", "");
          break;
        }
      }
    } else {
      notiText =
        "Something went wrong at our side. Please try again after refreshing the page.";
    }
    dispatch(
      addNotification({
        type: "error",
        title: "Operation Failed",
        text: notiText,
      })
    );
  };

  const { mutate: editElement, isLoading: isEditLoading } = useMutation(
    (mutationData) =>
      editElementDetails({ data: mutationData, layerKey, elementId }),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    }
  );

  const handleSubmit = useCallback(() => {
    // convert markder coordinates
    let geometry;
    if (featureType === "polyline") {
      const featureCoords = getCoordinatesFromFeature(featureRef.current);
      geometry = latLongMapToLineCoords(featureCoords);
    } else {
      const featureCoords = getMarkerCoordinatesFromFeature(featureRef.current);
      geometry = latLongMapToCoords([featureCoords])[0];
    }
    editElement({
      geometry,
    });
  }, []);

  const handleEditFeatureLoad = useCallback((feature) => {
    featureRef.current = feature;
  }, []);

  const handleCancel = useCallback(() => {
    // go back to details
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: { elementId },
      })
    );
    featureRef.current.setMap(null);
  }, [layerKey]);

  const FeatureOnMap = useMemo(() => {
    if (featureType === "polyline") {
      return (
        <Polyline
          path={coordsToLatLongMap(coordinates)}
          options={{
            ...options,
            clickable: true,
            draggable: true,
            editable: true,
            zIndex: 50,
          }}
          onLoad={handleEditFeatureLoad}
        />
      );
    } else {
      return (
        <Marker
          options={{
            icon,
            clickable: true,
            draggable: true,
            editable: true,
            geodesic: false,
            zIndex: 50,
            ...options,
          }}
          onLoad={handleEditFeatureLoad}
          position={coordsToLatLongMap([coordinates])[0]}
        />
      );
    }
  }, [featureType, options]);

  return (
    <>
      {FeatureOnMap}
      <GisMapPopups>
        <Paper>
          <Box
            minWidth="350px"
            maxWidth="550px"
            sx={{ backgroundColor: "secondary.light" }}
            p={2}
          >
            <Typography color="background.default" mb={2} variant="h6">
              {helpText}
            </Typography>
            <Stack spacing={2} direction="row">
              <LoadingButton
                sx={{ minWidth: "10em" }}
                disableElevation
                variant="contained"
                color="success"
                onClick={handleSubmit}
                loading={isEditLoading}
              >
                Submit
              </LoadingButton>
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

export default EditGisLayer;
