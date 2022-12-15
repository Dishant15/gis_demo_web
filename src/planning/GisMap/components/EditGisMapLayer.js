import React, { useCallback, useMemo, useRef } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Marker, Polygon, Polyline } from "@react-google-maps/api";

import get from "lodash/get";
import round from "lodash/round";
import size from "lodash/size";
import { lineString, length, area, polygon, convertArea } from "@turf/turf";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GisMapPopups from "./GisMapPopups";

import useValidateGeometry from "../hooks/useValidateGeometry";
import useEditTicketArea from "ticket/hook/useEditTicketArea";
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
import { setMapState, unHideElement } from "planning/data/planningGis.reducer";
import { handleLayerSelect } from "planning/data/planningState.reducer";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import { FEATURE_TYPES, zIndexMapping } from "../layers/common/configuration";
import { DRAG_ICON_WIDTH } from "utils/constant";

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

const EditGisMapLayer = ({ layerKey, editElementAction }) => {
  const dispatch = useDispatch();
  const featureRef = useRef();
  const { errPolygons, validateElementMutation, isValidationLoading } =
    useValidateGeometry();

  const mapStateData = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const { elementId, coordinates } = mapStateData;
  // layer key based data default data from utils -> LayerKeyMappings
  const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);

  const onSuccessHandler = (res) => {
    // do not fire notification if response is undefined
    if (res) {
      dispatch(
        addNotification({
          type: "success",
          title: "Element location updated Successfully",
        })
      );
    }
    dispatch(handleLayerSelect(layerKey));
    // refetch layer
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      })
    );
    // clear map refs
    featureRef.current.setMap(null);
    // unhide element from layerData
    dispatch(unHideElement({ layerKey, elementId }));
    // complete current event -> fire next event OR go to details by default
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: { elementId },
      })
    );
  };

  const onErrorHandler = (err) => {
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

  const { editTicketAreaMutation, isTicketAreaEditing } = useEditTicketArea({
    onSuccess: onSuccessHandler,
    onError: onErrorHandler,
  });

  const { mutate: editElement, isLoading: isEditLoading } = useMutation(
    (mutationData) =>
      !!editElementAction
        ? editElementAction(mutationData)
        : editElementDetails({ data: mutationData, layerKey, elementId }),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    }
  );

  const handleSubmit = useCallback(async () => {
    // convert markder coordinates
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      const featureCoords = getCoordinatesFromFeature(featureRef.current);
      submitData.geometry = latLongMapToLineCoords(featureCoords);
      submitData.gis_len = round(length(lineString(submitData.geometry)), 4);
    }
    //
    else if (
      featureType === FEATURE_TYPES.POLYGON ||
      featureType === FEATURE_TYPES.MULTI_POLYGON
    ) {
      const featureCoords = getCoordinatesFromFeature(featureRef.current);
      submitData.geometry = latLongMapToCoords(featureCoords);
      // get area of polygon
      const areaInMeters = area(polygon([submitData.geometry]));
      submitData.gis_area = round(
        convertArea(areaInMeters, "meters", "kilometers"),
        4
      );
    }
    //
    else if (featureType === FEATURE_TYPES.POINT) {
      const featureCoords = getMarkerCoordinatesFromFeature(featureRef.current);
      submitData.geometry = latLongMapToCoords([featureCoords])[0];
    }
    //
    else {
      throw new Error("feature type is invalid");
    }
    // server side validate geometry
    validateElementMutation(
      {
        layerKey,
        element_id: elementId,
        featureType,
        geometry: submitData.geometry,
        region_id_list: selectedRegionIds,
      },
      {
        onSuccess: (res) => {
          // update submit data based on validation res
          const children = get(res, "data.children", {});
          const getDependantFields = get(
            LayerKeyMappings,
            [layerKey, "getDependantFields"],
            ({ submitData }) => submitData
          );
          submitData = getDependantFields({ submitData, children });
          submitData.association = get(res, "data", {});

          if (layerKey === "ticket") {
            editTicketAreaMutation({
              ticketId: elementId,
              data: { coordinates: submitData.geometry },
            });
          } else {
            // PATCH
            if (layerKey === "region") {
              if (mapStateData?.parent) {
                submitData.parentId = mapStateData.parent;
              }
              if (mapStateData?.layer) {
                submitData.layer = mapStateData.layer;
              }
            }
            editElement(submitData);
          }
        },
      }
    );
  }, [layerKey, selectedRegionIds, elementId, mapStateData]);

  const handleEditFeatureLoad = useCallback((feature) => {
    featureRef.current = feature;
  }, []);

  const handleCancel = useCallback(() => {
    // unhide element from layerData
    dispatch(unHideElement({ layerKey, elementId }));
    // go back to details
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: { elementId },
      })
    );
    featureRef.current.setMap(null);
  }, [layerKey, elementId]);

  // helpText show in popup based on featureType
  const helpText = useMemo(() => {
    switch (featureType) {
      case FEATURE_TYPES.POLYLINE:
        return "Click on map to create line on map. Double click to complete.";
      case FEATURE_TYPES.POLYGON:
        return "Click on map to place area points on map. Complete polygon and adjust points.";
      case FEATURE_TYPES.MULTI_POLYGON:
        return "Click on map to place area points on map. Complete polygon and adjust points.";
      case FEATURE_TYPES.POINT:
        return "Click or drag and drop marker to new location";
      default:
        return "";
    }
  }, [featureType]);

  const FeatureOnMap = useMemo(() => {
    const options = get(LayerKeyMappings, [layerKey, "getViewOptions"])(
      mapStateData
    );

    if (featureType === FEATURE_TYPES.POLYLINE) {
      return (
        <Polyline
          path={coordsToLatLongMap(coordinates)}
          options={{
            ...options,
            ...GisEditOptions,
            icon: undefined,
            pin: undefined,
          }}
          onLoad={handleEditFeatureLoad}
        />
      );
    } else if (featureType === FEATURE_TYPES.POLYGON) {
      return (
        <Polygon
          path={coordsToLatLongMap(coordinates)}
          options={{
            ...options,
            ...GisEditOptions,
            icon: undefined,
            pin: undefined,
          }}
          onLoad={handleEditFeatureLoad}
        />
      );
    } else if (featureType === FEATURE_TYPES.MULTI_POLYGON) {
      return (
        <Polygon
          path={coordsToLatLongMap(coordinates[0][0])}
          options={{
            ...options,
            ...GisEditOptions,
            icon: undefined,
            pin: undefined,
          }}
          onLoad={handleEditFeatureLoad}
        />
      );
    } else if (featureType === FEATURE_TYPES.POINT) {
      return (
        <Marker
          options={{
            ...options,
            ...GisMarkerEditOptions,
            icon: options.pin,
            pin: undefined,
          }}
          onLoad={handleEditFeatureLoad}
          position={coordsToLatLongMap([coordinates])[0]}
        />
      );
    } else {
      return null;
    }
  }, [featureType, layerKey, mapStateData, coordinates]);

  const loading = isEditLoading || isValidationLoading || isTicketAreaEditing;

  return (
    <>
      {FeatureOnMap}
      {!!size(errPolygons) ? (
        <>
          {errPolygons.map((ePoly, eInd) => {
            return (
              <Polygon
                key={eInd}
                path={ePoly}
                options={{
                  strokeColor: "red",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "red",
                  fillOpacity: 0.5,
                  clickable: false,
                  draggable: false,
                  editable: false,
                }}
              />
            );
          })}
        </>
      ) : null}
      <GisMapPopups dragId="edit-gis-map-layer">
        <Paper>
          <Box
            minWidth="350px"
            maxWidth="550px"
            sx={{ backgroundColor: "secondary.light" }}
            p={2}
          >
            <Typography
              color="background.default"
              mb={2}
              variant="h6"
              pl={`${DRAG_ICON_WIDTH - 16}px`}
            >
              {helpText}
            </Typography>
            <Stack spacing={2} direction="row">
              <LoadingButton
                sx={{ minWidth: "10em" }}
                disableElevation
                variant="contained"
                color="success"
                onClick={handleSubmit}
                loading={loading}
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

export default EditGisMapLayer;
