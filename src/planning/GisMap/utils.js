import orderBy from "lodash/orderBy";
import { coordsToLatLongMap } from "utils/map.utils";

import * as RegionLayer from "./layers/region";
import * as TicketLayer from "./layers/ticket";
import * as DPLayer from "./layers/p_dp";
import * as SplitterLayer from "./layers/p_splitter";
import * as CableLayer from "./layers/p_cable";
import * as BuildingLayer from "./layers/p_survey_building";
import * as SAreaLayer from "./layers/p_survey_area";

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElement: "A",
  editElementLocation: "E",
  showElementForm: "F",
  editElementDetails: "EF",
  showElementDetails: "D",
  showElementConnections: "EC",
  addElementConnection: "AC",
};

export const LayerKeyMappings = {
  [RegionLayer.LAYER_KEY]: {
    Icon: RegionLayer.Icon,
    featureType: RegionLayer.LAYER_FEATURE_TYPE,
  },
  [TicketLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <TicketLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <TicketLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <TicketLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <TicketLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <TicketLayer.ElementForm />,
    Geometry: TicketLayer.Geometry,
    Icon: TicketLayer.Icon,
    featureType: TicketLayer.LAYER_FEATURE_TYPE,
  },
  [DPLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <DPLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <DPLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <DPLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <DPLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <DPLayer.ElementForm />,
    Icon: DPLayer.Icon,
    featureType: DPLayer.LAYER_FEATURE_TYPE,
  },
  [SplitterLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <SplitterLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <SplitterLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <SplitterLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <SplitterLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <SplitterLayer.ElementForm />,
    Icon: SplitterLayer.getIcon,
    featureType: SplitterLayer.LAYER_FEATURE_TYPE,
    ConfigFormTemplate: SplitterLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: SplitterLayer.INITIAL_CONFIG_DATA,
    TableColDefs: SplitterLayer.CONFIG_LIST_TABLE_COL_DEFS,
    configTransformData: SplitterLayer.transformAndValidateConfigData,
    [PLANNING_EVENT.showElementConnections]: (
      <SplitterLayer.ElementConnections />
    ),
    [PLANNING_EVENT.addElementConnection]: <SplitterLayer.LayerAddConnection />,
  },
  [CableLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <CableLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <CableLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <CableLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <CableLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <CableLayer.ElementForm />,
    Icon: CableLayer.getIcon,
    featureType: CableLayer.LAYER_FEATURE_TYPE,
    ConfigFormTemplate: CableLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: CableLayer.INITIAL_CONFIG_DATA,
    TableColDefs: CableLayer.CONFIG_LIST_TABLE_COL_DEFS,
    configTransformData: CableLayer.transformAndValidateConfigData,
  },
  [BuildingLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <BuildingLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <BuildingLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <BuildingLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <BuildingLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <BuildingLayer.ElementForm />,
    Icon: BuildingLayer.Icon,
    featureType: BuildingLayer.LAYER_FEATURE_TYPE,
  },
  [SAreaLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <SAreaLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <SAreaLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <SAreaLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <SAreaLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <SAreaLayer.ElementForm />,
    Icon: SAreaLayer.Icon,
    featureType: SAreaLayer.LAYER_FEATURE_TYPE,
  },
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = orderBy(serverData, ["id"], ["desc"]);

  // PolyLine / Polygon
  if (
    layerKey === CableLayer.LAYER_KEY ||
    layerKey === SAreaLayer.LAYER_KEY ||
    layerKey === TicketLayer.LAYER_KEY
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
  else if (
    layerKey === DPLayer.LAYER_KEY ||
    layerKey === SplitterLayer.LAYER_KEY ||
    layerKey === BuildingLayer.LAYER_KEY
  ) {
    resultData.map((d) => {
      d.geometry = [...d.coordinates];
      d.coordinates = coordsToLatLongMap([d.coordinates])[0];
    });
    return resultData;
  }
  // Multi polygon - regions
  else if (layerKey === RegionLayer.LAYER_KEY) {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
};
