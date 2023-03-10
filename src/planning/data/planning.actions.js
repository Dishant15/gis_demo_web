import {
  circle,
  point,
  lineString,
  booleanIntersects,
  distance,
} from "@turf/turf";
import get from "lodash/get";
import size from "lodash/size";
import merge from "lodash/merge";

import {
  getLayerSelectedConfiguration,
  getSelectedLayerKeys,
} from "./planningState.selectors";
import {
  handleLayerSelect,
  handleRegionSelect,
  selectConfiguration,
  setLayerConfigurations,
} from "./planningState.reducer";
import { fetchLayerDataThunk } from "./actionBar.services";
import {
  getAllLayersData,
  getLayerViewData,
  getMasterViewData,
  getPlanningMapStateData,
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
import {
  coordsToLatLongMap,
  pointCoordsToLatLongMap,
  pointLatLongMapToCoords,
} from "utils/map.utils";
import { FEATURE_TYPES } from "planning/GisMap/layers/common/configuration";
import { listElementsOnMap } from "./event.actions";
import {
  filterGisDataByPolygon,
  generateNetworkIdFromParent,
} from "./planning.utils";

export const onGisMapClick = (mapMouseEvent) => (dispatch, getState) => {
  const storeState = getState();
  const mapStateEvent = getPlanningMapStateEvent(storeState);

  if (
    mapStateEvent === PLANNING_EVENT.selectElementsOnMapClick ||
    mapStateEvent === PLANNING_EVENT.associateElementOnMapClick
  ) {
    const clickLatLong = mapMouseEvent.latLng.toJSON();

    const layerData = getAllLayersData(storeState);
    const selectedLayerKeys = getSelectedLayerKeys(storeState);

    // if ths is select elements event get list of elements around user click
    const clickPoint = pointLatLongMapToCoords(clickLatLong);
    // create a circle at user click location
    const circPoly = circle(clickPoint, 0.01, {
      steps: 10,
      units: "kilometers",
    });

    let whiteList,
      blackList,
      elementData = {},
      extraParent = {};
    if (mapStateEvent === PLANNING_EVENT.selectElementsOnMapClick) {
      whiteList = selectedLayerKeys;
      blackList = ["region"];
    } else if (mapStateEvent === PLANNING_EVENT.associateElementOnMapClick) {
      const mapStateData = getPlanningMapStateData(storeState);
      elementData = mapStateData.elementData;
      extraParent = mapStateData.extraParent;
      // listOfLayers will be all the possible layers user can associate with current parent
      whiteList = mapStateData.listOfLayers;
      blackList = [];
    }

    const elementResultList = filterGisDataByPolygon({
      filterPolygon: circPoly,
      gisData: layerData,
      whiteList,
      blackList,
    });
    const filterCoords = coordsToLatLongMap(circPoly.geometry.coordinates[0]);
    // fire next event : listElementsOnMap, with new list data
    dispatch(
      listElementsOnMap({
        // association related fields
        elementData,
        extraParent,
        // actual filtered elements
        elementList: elementResultList,
        // polygon coords used to filter
        filterCoords,
        // info for next event that current filter was for association list or not
        isAssociationList:
          mapStateEvent === PLANNING_EVENT.associateElementOnMapClick,
      })
    );
  }
};

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
  ({ layerKey, elementId, elementGeometry }) =>
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
    const circPoly = circle(elementGeometry, 0.01, {
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
  ({ layerKey, restriction_ids = null }) =>
  (dispatch) => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementGeometry,
        layerKey,
        data: { restriction_ids },
      })
    );
  };

// called when user going to AddGisLayerFORM
export const onAddElementDetails =
  ({ layerKey, submitData, validationRes, extraParent }) =>
  (dispatch, getState) => {
    const initialData = get(LayerKeyMappings, [layerKey, "initialElementData"]);
    const storeState = getState();
    const selectedConfig = getLayerSelectedConfiguration(layerKey)(storeState);

    // generate ids
    let unique_id = generateElementUid(layerKey);

    // generate parent association data from parents res
    // shape: { layerKey : [{id, name, uid, netid}, ... ], ...]
    const parents = get(validationRes, "data.parents", {});
    const region_list = get(validationRes, "data.region_list");
    const network_id = generateNetworkIdFromParent(
      unique_id,
      parents,
      region_list
    );
    // generate children association data from children res
    const children = get(validationRes, "data.children", {});

    const getDependantFields = get(
      LayerKeyMappings,
      [layerKey, "getDependantFields"],
      ({ submitData }) => submitData
    );
    submitData = getDependantFields({
      submitData,
      children,
      parents,
      region_list,
    });

    // add config id if layer is configurable
    const configuration = selectedConfig?.id;

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
          association: { parents: merge(parents, extraParent), children },
          configuration,
        },
      })
    );
  };

//////////////////////////////////////////////
//         show on map utils                //
//////////////////////////////////////////////

export const onPointShowOnMap =
  (coordinates, elementId, layerKey) => (dispatch) => {
    dispatch(
      setMapPosition({
        center: coordinates,
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
        center: center,
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
      zoom: 18,
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

export const onTableDetailsShowOnMapClick =
  (element, layerKey) => (dispatch) => {
    const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);
    switch (featureType) {
      case FEATURE_TYPES.POINT:
        dispatch(
          onPointShowOnMap(
            pointCoordsToLatLongMap(element.coordinates),
            element.id,
            layerKey
          )
        );
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(
          onPolygonShowOnMap(
            pointCoordsToLatLongMap(element.center),
            element.id,
            layerKey
          )
        );
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
        dispatch(
          onPointShowOnMap(
            pointCoordsToLatLongMap(element.coordinates),
            element.id,
            layerKey
          )
        );
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(
          onPolygonShowOnMap(
            pointCoordsToLatLongMap(element.center),
            element.id,
            layerKey
          )
        );
        break;
      default:
        break;
    }
  };

export const onElementListItemClick = (element) => (dispatch) => {
  const layerKey = element.layerKey;
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

export const onLayerElementListItemClick =
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

export const onFetchLayerListDetailsSuccess = (layerConfData) => (dispatch) => {
  // res shape same as layerConfigs bellow
  if (!!size(layerConfData)) {
    for (let lc_ind = 0; lc_ind < layerConfData.length; lc_ind++) {
      const { layer_key, is_configurable, configuration } =
        layerConfData[lc_ind];
      if (is_configurable) {
        // if layerConfData is there set layer configs in redux
        dispatch(
          setLayerConfigurations({
            layerKey: layer_key,
            configurationList: configuration,
          })
        );
        // select default configs to show first
        dispatch(
          selectConfiguration({
            layerKey: layer_key,
            configuration: configuration[0],
          })
        );
      }
    }
  }
};

export const onLayerTabElementList = (layerKey) => (dispatch, getState) => {
  const storeState = getState();
  // element list based on cached or master data list
  let elementResultList = getMasterViewData(layerKey)(storeState);
  // fire next event : listElementsOnMap, with new list data
  dispatch(
    setMapState({
      event: PLANNING_EVENT.layerElementsOnMap,
      data: {
        elementList: elementResultList,
        elementLayerKey: layerKey,
      },
    })
  );
};
