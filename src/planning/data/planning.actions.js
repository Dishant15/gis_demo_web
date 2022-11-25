import {
  circle,
  point,
  lineString,
  booleanIntersects,
  distance,
} from "@turf/turf";
import get from "lodash/get";
import last from "lodash/last";
import size from "lodash/size";
import has from "lodash/has";

import { getSelectedLayerKeys } from "./planningState.selectors";
import { handleLayerSelect, handleRegionSelect } from "./planningState.reducer";
import { fetchLayerDataThunk } from "./actionBar.services";
import {
  getLayerViewData,
  getPlanningMapStateEvent,
} from "./planningGis.selectors";
import {
  resetMapHighlight,
  resetTicketMapHighlight,
  resetUnselectedLayerGisData,
  setMapHighlight,
  setMapPosition,
  setMapState,
  setTicketMapHighlight,
  toggleMapPopupMinimize,
} from "./planningGis.reducer";
import {
  generateElementUid,
  LayerKeyMappings,
  PLANNING_EVENT,
} from "planning/GisMap/utils";
import { addNotification } from "redux/reducers/notification.reducer";
import { pointCoordsToLatLongMap } from "utils/map.utils";
import { FEATURE_TYPES } from "planning/GisMap/layers/common/configuration";

export const onRegionSelectionUpdate =
  (updatedRegionIdList) => (dispatch, getState) => {
    const storeState = getState();
    const selectedLayerKeys = getSelectedLayerKeys(storeState);

    // set selected regions
    dispatch(handleRegionSelect(updatedRegionIdList));
    // add region in selectedLayerKeys if not
    if (selectedLayerKeys.indexOf("region") === -1) {
      dispatch(handleLayerSelect("region"));
    }
    // fetch gis data for all region polygons
    dispatch(
      fetchLayerDataThunk({
        regionIdList: updatedRegionIdList,
        layerKey: "region",
      })
    );
    // re fetch data for each selected layers
    for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
      const currLayerKey = selectedLayerKeys[l_ind];
      dispatch(
        fetchLayerDataThunk({
          regionIdList: updatedRegionIdList,
          layerKey: currLayerKey,
        })
      );
    }
    dispatch(resetUnselectedLayerGisData(selectedLayerKeys));
  };

export const onElementAddConnectionEvent =
  ({ layerKey, elementId, elementGeometry, existingConnections }) =>
  (dispatch, getState) => {
    const storeState = getState();
    // check if cable layer is selected in layers tab
    const selectedLayerKeys = getSelectedLayerKeys(storeState);
    if (selectedLayerKeys.indexOf("p_cable") === -1) {
      // dispatch error notification if not
      dispatch(
        addNotification({
          type: "error",
          title: "Please select Cable layer",
          text: "Cable layer needs to be selected to add connections",
        })
      );
      return;
    }
    let resultCableList = [];
    // if point element
    const elementPoint = point(elementGeometry);
    // create a circle around element
    const circPoly = circle(elementGeometry, 0.1, {
      steps: 10,
      units: "kilometers",
    });
    // get all cables intersecting that polygon
    const cableList = getLayerViewData("p_cable")(storeState);
    for (let c_ind = 0; c_ind < cableList.length; c_ind++) {
      const c_cable = cableList[c_ind];
      const isIntersecting = booleanIntersects(
        circPoly,
        lineString(c_cable.geometry)
      );
      if (isIntersecting) {
        // calculate which end of this cable is nearest to current point
        const Aend = c_cable.geometry[0];
        const Bend = c_cable.geometry[c_cable.geometry.length - 1];

        const distanceA = distance(elementPoint, point(Aend));
        const distanceB = distance(elementPoint, point(Bend));
        const cable_end = distanceA > distanceB ? "B" : "A";
        // add list of cables into data of current element, with cable end marker
        resultCableList.push({ ...c_cable, cable_end, layerKey: "p_cable" });
      }
    }
    // dispatch addElementConection
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementConnection,
        layerKey,
        data: {
          elementList: resultCableList,
          elementId,
          layerKey,
          existingConnections,
        },
      })
    );
  };

export const openElementDetails =
  ({ layerKey, elementId }) =>
  (dispatch) => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: { elementId },
      })
    );
  };

// add geometry with optinal associations
export const onAddElementGeometry =
  ({ layerKey, association = null, checks_list = null }) =>
  (dispatch, getState) => {
    // const storeState = getState();
    // const event = getPlanningMapStateEvent(storeState);
    // // show error if one event already running
    // if (event) {
    //   dispatch(
    //     addNotification({
    //       type: "warning",
    //       title: "Operation can not start",
    //       text: "Please complete current operation before starting new",
    //     })
    //   );
    //   return;
    // }
    // start event if no other event running
    let data = {};
    if (!!association) data.association = association;
    if (!!checks_list) data.checks_list = checks_list;
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementGeometry,
        layerKey,
        data,
      })
    );
  };

// called when user goes AddGisMapLayer ->
export const onAddElementDetails =
  ({ layerKey, submitData, validationRes, parentNetId = null }) =>
  (dispatch) => {
    const initialData = get(LayerKeyMappings, [layerKey, "initialElementData"]);
    // generate ids
    // if validationRes has association data than generate net id from parent
    const isAssociationRes = has(submitData, "association");
    let unique_id = generateElementUid(layerKey);
    let network_id = "";

    if (isAssociationRes) {
      // generate network id from parent if association add
      const parent_layer_key = get(submitData, "association.parent_layer_key");
      // if parent id passed use that directly else get from validationRes
      const parent_id = !!parentNetId
        ? parentNetId
        : get(validationRes, ["data", parent_layer_key, "0", "network_id"]);
      network_id = `${parent_id}-${unique_id}`;
    } else {
      // generate from region if simple add
      const region_list = get(validationRes, "data.region_list");
      // get region uid
      const reg_uid = !!size(region_list) ? last(region_list).unique_id : "RGN";
      network_id = `${reg_uid}-${unique_id}`;
    }

    // complete current event -> fire next event
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementForm, // event for "layerForm"
        layerKey,
        data: {
          ...initialData,
          // submit data will have all geometry related fields submitted by AddGisMapLayer
          ...submitData,
          unique_id,
          network_id,
        },
      })
    );
  };

export const onPointShowOnMap =
  (coordinates, elementId, layerKey) => (dispatch) => {
    dispatch(
      setMapPosition({
        center: pointCoordsToLatLongMap(coordinates),
        zoom: 18,
      })
    );
    dispatch(
      setMapHighlight({
        layerKey,
        elementId,
      })
    );
    dispatch(toggleMapPopupMinimize(false));
    dispatch(resetTicketMapHighlight());
  };

export const onPolygonShowOnMap =
  (center, elementId, layerKey) => (dispatch) => {
    dispatch(
      setMapPosition({
        center: pointCoordsToLatLongMap(center),
        zoom: 16,
      })
    );
    dispatch(
      setMapHighlight({
        layerKey,
        elementId,
      })
    );
    dispatch(toggleMapPopupMinimize(false));
    dispatch(resetTicketMapHighlight());
  };

export const onTicketPointShowOnMap = (coordinates, woId) => (dispatch) => {
  dispatch(
    setMapPosition({
      center: coordinates,
      zoom: 18,
    })
  );
  dispatch(setTicketMapHighlight(woId));
  dispatch(resetMapHighlight());
};

export const onTicketPolygonShowOnMap = (center, woId) => (dispatch) => {
  dispatch(
    setMapPosition({
      center: center,
      zoom: 16,
    })
  );
  dispatch(setTicketMapHighlight(woId));
  dispatch(resetMapHighlight());
};

export const onTicketWoShowOnMapClick = (woData) => (dispatch) => {
  const featureType = get(LayerKeyMappings, [woData.layer_key, "featureType"]);
  switch (featureType) {
    case FEATURE_TYPES.POINT:
      dispatch(onTicketPointShowOnMap(woData.element.coordinates, woData.id));
      break;
    case FEATURE_TYPES.POLYGON:
    case FEATURE_TYPES.POLYLINE:
    case FEATURE_TYPES.MULTI_POLYGON:
      dispatch(onTicketPolygonShowOnMap(woData.element.center, woData.id));
      break;
    default:
      break;
  }
};

export const onAssociatedElementShowOnMapClick =
  (element, layerKey) => (dispatch) => {
    const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);
    switch (featureType) {
      case FEATURE_TYPES.POINT:
        dispatch(onPointShowOnMap(element.coordinates, element.id, layerKey));
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(onPolygonShowOnMap(element.center, element.id, layerKey));
        break;
      default:
        break;
    }
  };
