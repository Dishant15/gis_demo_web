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
};

export const LayerKeyMappings = {
  [RegionLayer.LAYER_KEY]: {
    featureType: RegionLayer.LAYER_FEATURE_TYPE,
    getViewOptions: RegionLayer.getViewOptions,
  },
  [TicketLayer.LAYER_KEY]: {
    [PLANNING_EVENT.editElementGeometry]: <TicketLayer.EditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <TicketLayer.ElementForm />,
    [PLANNING_EVENT.editElementForm]: <TicketLayer.ElementForm />,
    featureType: TicketLayer.LAYER_FEATURE_TYPE,
    getViewOptions: TicketLayer.getViewOptions,
    initialElementData: TicketLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: TicketLayer.ELEMENT_TABLE_FIELDS,
  },
  [DPLayer.LAYER_KEY]: {
    [PLANNING_EVENT.editElementGeometry]: <DPLayer.EditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <DPLayer.ElementForm />,
    [PLANNING_EVENT.editElementForm]: <DPLayer.ElementForm />,
    featureType: DPLayer.LAYER_FEATURE_TYPE,
    getViewOptions: DPLayer.getViewOptions,
    initialElementData: DPLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: DPLayer.ELEMENT_TABLE_FIELDS,
  },
  [SplitterLayer.LAYER_KEY]: {
    [PLANNING_EVENT.editElementGeometry]: <SplitterLayer.EditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <SplitterLayer.ElementForm />,
    [PLANNING_EVENT.editElementForm]: <SplitterLayer.ElementForm />,
    featureType: SplitterLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SplitterLayer.getViewOptions,
    // config fields
    ConfigFormTemplate: SplitterLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: SplitterLayer.INITIAL_CONFIG_DATA,
    TableColDefs: SplitterLayer.CONFIG_LIST_TABLE_COL_DEFS,
    configTransformData: SplitterLayer.transformAndValidateConfigData,
    // extra events
    [PLANNING_EVENT.showElementConnections]: (
      <SplitterLayer.ElementConnections />
    ),
    [PLANNING_EVENT.addElementConnection]: <SplitterLayer.LayerAddConnection />,
    initialElementData: SplitterLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SplitterLayer.ELEMENT_TABLE_FIELDS,
  },
  [CableLayer.LAYER_KEY]: {
    [PLANNING_EVENT.editElementGeometry]: <CableLayer.EditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <CableLayer.ElementForm />,
    [PLANNING_EVENT.editElementForm]: <CableLayer.ElementForm />,
    featureType: CableLayer.LAYER_FEATURE_TYPE,
    getViewOptions: CableLayer.getViewOptions,
    initialElementData: CableLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: CableLayer.ELEMENT_TABLE_FIELDS,
    // config fields
    ConfigFormTemplate: CableLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: CableLayer.INITIAL_CONFIG_DATA,
    TableColDefs: CableLayer.CONFIG_LIST_TABLE_COL_DEFS,
    configTransformData: CableLayer.transformAndValidateConfigData,
  },
  [BuildingLayer.LAYER_KEY]: {
    [PLANNING_EVENT.editElementGeometry]: <BuildingLayer.EditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <BuildingLayer.ElementForm />,
    [PLANNING_EVENT.editElementForm]: <BuildingLayer.ElementForm />,
    featureType: BuildingLayer.LAYER_FEATURE_TYPE,
    getViewOptions: BuildingLayer.getViewOptions,
    initialElementData: BuildingLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: BuildingLayer.ELEMENT_TABLE_FIELDS,
  },
  [SAreaLayer.LAYER_KEY]: {
    [PLANNING_EVENT.editElementGeometry]: <SAreaLayer.EditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <SAreaLayer.ElementForm />,
    [PLANNING_EVENT.editElementForm]: <SAreaLayer.ElementForm />,
    featureType: SAreaLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SAreaLayer.getViewOptions,
    initialElementData: SAreaLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SAreaLayer.ELEMENT_TABLE_FIELDS,
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
