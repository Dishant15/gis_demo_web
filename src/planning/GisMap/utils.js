import orderBy from "lodash/orderBy";
import { coordsToLatLongMap } from "utils/map.utils";
import { FEATURE_TYPES } from "./layers/common/configuration";

import * as RegionLayer from "./layers/region";
import * as TicketLayer from "./layers/ticket";
import * as DPLayer from "./layers/p_dp";
import * as SplitterLayer from "./layers/p_splitter";
import * as CableLayer from "./layers/p_cable";
import * as BuildingLayer from "./layers/p_survey_building";
import * as SAreaLayer from "./layers/p_survey_area";

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElementGeometry: "A",
  editElementGeometry: "E",
  addElementForm: "F",
  editElementForm: "EF",
  showElementDetails: "D",
  showElementConnections: "EC",
  addElementConnection: "AC",
  showTicketWorkOrders: "SWo",
};

export const LayerKeyMappings = {
  [RegionLayer.LAYER_KEY]: {
    featureType: RegionLayer.LAYER_FEATURE_TYPE,
    getViewOptions: RegionLayer.getViewOptions,
    elementTableFields: RegionLayer.ELEMENT_TABLE_FIELDS,
  },
  [TicketLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElementForm]: TicketLayer.ElementForm,
    [PLANNING_EVENT.editElementForm]: TicketLayer.ElementForm,
    featureType: TicketLayer.LAYER_FEATURE_TYPE,
    getViewOptions: TicketLayer.getViewOptions,
    initialElementData: TicketLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: TicketLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: TicketLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
  [DPLayer.LAYER_KEY]: {
    featureType: DPLayer.LAYER_FEATURE_TYPE,
    getViewOptions: DPLayer.getViewOptions,
    initialElementData: DPLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: DPLayer.ELEMENT_TABLE_FIELDS,
    formConfig: DPLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: DPLayer.transformAndValidateData,
  },
  [SplitterLayer.LAYER_KEY]: {
    featureType: SplitterLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SplitterLayer.getViewOptions,
    initialElementData: SplitterLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SplitterLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: SplitterLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: SplitterLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: SplitterLayer.transformAndValidateData,
    // config fields
    ConfigFormTemplate: SplitterLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: SplitterLayer.INITIAL_CONFIG_DATA,
    TableColDefs: SplitterLayer.CONFIG_LIST_TABLE_COL_DEFS,
    configTransformData: SplitterLayer.transformAndValidateConfigData,
  },
  [CableLayer.LAYER_KEY]: {
    featureType: CableLayer.LAYER_FEATURE_TYPE,
    getViewOptions: CableLayer.getViewOptions,
    initialElementData: CableLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: CableLayer.ELEMENT_TABLE_FIELDS,
    formConfig: CableLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: CableLayer.transformAndValidateData,
    // config fields
    ConfigFormTemplate: CableLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: CableLayer.INITIAL_CONFIG_DATA,
    TableColDefs: CableLayer.CONFIG_LIST_TABLE_COL_DEFS,
    configTransformData: CableLayer.transformAndValidateConfigData,
  },
  [BuildingLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElementForm]: BuildingLayer.ElementForm,
    [PLANNING_EVENT.editElementForm]: BuildingLayer.ElementForm,
    featureType: BuildingLayer.LAYER_FEATURE_TYPE,
    getViewOptions: BuildingLayer.getViewOptions,
    initialElementData: BuildingLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: BuildingLayer.ELEMENT_TABLE_FIELDS,
  },
  [SAreaLayer.LAYER_KEY]: {
    featureType: SAreaLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SAreaLayer.getViewOptions,
    initialElementData: SAreaLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SAreaLayer.ELEMENT_TABLE_FIELDS,
    formConfig: SAreaLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: SAreaLayer.transformAndValidateData,
  },
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = orderBy(serverData, ["id"], ["desc"]);
  const featureType = LayerKeyMappings[layerKey]["featureType"];

  // PolyLine / Polygon
  if (
    featureType === FEATURE_TYPES.POLYGON ||
    featureType === FEATURE_TYPES.POLYLINE
  ) {
    resultData.map((d) => {
      d.geometry = [...d.coordinates];
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // Point gis layer
  else if (featureType === FEATURE_TYPES.POINT) {
    resultData.map((d) => {
      d.geometry = [...d.coordinates];
      d.coordinates = coordsToLatLongMap([d.coordinates])[0];
    });
    return resultData;
  }
  // Multi polygon
  else if (featureType === FEATURE_TYPES.MULTI_POLYGON) {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
};
