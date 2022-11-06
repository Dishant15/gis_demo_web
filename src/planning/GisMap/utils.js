import orderBy from "lodash/orderBy";
import { coordsToLatLongMap } from "utils/map.utils";
import {
  ViewLayer as RegionViewLayer,
  LAYER_KEY as RegionKey,
} from "./layers/region";
import * as TicketLayer from "./layers/ticket";
import {
  ViewLayer as DPViewLayer,
  AddMapLayer as DPAddLayer,
  EditMapLayer as DpEditMapLayer,
  Geometry as DPGeometry,
  LAYER_KEY as DpKey,
  ElementForm as DpForm,
  ElementDetails as DpDetails,
  Icon as DpIcon,
} from "./layers/p_dp";
import {
  LAYER_KEY as SplitterKey,
  ViewLayer as SplitterLayer,
  Geometry as SplitterGeometry,
  AddMapLayer as SplitterAddLayer,
  EditMapLayer as SplitterEditMapLayer,
  ElementForm as SplitterForm,
  ElementDetails as SplitterDetails,
  getIcon as SplitterGetIcon,
  ELEMENT_CONFIG_TEMPLATE as SplitterConfigFormTemplate,
  INITIAL_CONFIG_DATA as SplitterConfigInitData,
  CONFIG_LIST_TABLE_COL_DEFS as SplitterTableColDefs,
  transformAndValidateConfigData as spConfigTransformData,
  ElementConnections as SpListElemConn,
  LayerAddConnection as SpAddElemConn,
} from "./layers/p_splitter";
import {
  LAYER_KEY as CableKey,
  ViewLayer as CableLayer,
  Geometry as CableGeometry,
  AddMapLayer as CableAddLayer,
  EditMapLayer as CableEditMapLayer,
  ElementForm as CableForm,
  ElementDetails as CableDetails,
  getIcon as CableGetIcon,
  ELEMENT_CONFIG_TEMPLATE as CableConfigFormTemplate,
  INITIAL_CONFIG_DATA as CableConfigInitData,
  CONFIG_LIST_TABLE_COL_DEFS as CableTableColDefs,
  transformAndValidateConfigData as cblConfigTransformData,
} from "./layers/p_cable";
import {
  ViewLayer as BuildingViewLayer,
  AddMapLayer as BuildingAddLayer,
  EditMapLayer as BuildingEditMapLayer,
  Geometry as BuildingGeometry,
  LAYER_KEY as BuildingKey,
  ElementForm as BuildingForm,
  ElementDetails as BuildingDetails,
  Icon as BuildingIcon,
} from "./layers/p_survey_building";
import {
  ViewLayer as SAreaViewLayer,
  AddMapLayer as SAreaAddLayer,
  EditMapLayer as SAreaEditMapLayer,
  Geometry as SAreaGeometry,
  LAYER_KEY as SAreaKey,
  ElementForm as SAreaForm,
  ElementDetails as SAreaDetails,
  Icon as SAreaIcon,
} from "./layers/p_survey_area";

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
  [RegionKey]: {
    ViewLayer: RegionViewLayer,
  },
  [TicketLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElement]: <TicketLayer.AddMapLayer />,
    [PLANNING_EVENT.editElementLocation]: <TicketLayer.EditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <TicketLayer.ElementForm />,
    [PLANNING_EVENT.showElementDetails]: <TicketLayer.ElementDetails />,
    [PLANNING_EVENT.editElementDetails]: <TicketLayer.ElementForm />,
    ViewLayer: TicketLayer.ViewLayer,
    Geometry: TicketLayer.Geometry,
  },
  [DpKey]: {
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <DpEditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <DpForm />,
    [PLANNING_EVENT.showElementDetails]: <DpDetails />,
    [PLANNING_EVENT.editElementDetails]: <DpForm />,
    ViewLayer: DPViewLayer,
    Geometry: DPGeometry,
    Icon: DpIcon,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: <SplitterAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <SplitterEditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <SplitterForm />,
    [PLANNING_EVENT.showElementDetails]: <SplitterDetails />,
    [PLANNING_EVENT.editElementDetails]: <SplitterForm />,
    ViewLayer: SplitterLayer,
    Geometry: SplitterGeometry,
    Icon: SplitterGetIcon,
    ConfigFormTemplate: SplitterConfigFormTemplate,
    ConfigInitData: SplitterConfigInitData,
    TableColDefs: SplitterTableColDefs,
    configTransformData: spConfigTransformData,
    [PLANNING_EVENT.showElementConnections]: <SpListElemConn />,
    [PLANNING_EVENT.addElementConnection]: <SpAddElemConn />,
  },
  [CableKey]: {
    [PLANNING_EVENT.addElement]: <CableAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <CableEditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <CableForm />,
    [PLANNING_EVENT.showElementDetails]: <CableDetails />,
    [PLANNING_EVENT.editElementDetails]: <CableForm />,
    ViewLayer: CableLayer,
    Geometry: CableGeometry,
    Icon: CableGetIcon,
    ConfigFormTemplate: CableConfigFormTemplate,
    ConfigInitData: CableConfigInitData,
    TableColDefs: CableTableColDefs,
    configTransformData: cblConfigTransformData,
  },
  [BuildingKey]: {
    [PLANNING_EVENT.addElement]: <BuildingAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <BuildingEditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <BuildingForm />,
    [PLANNING_EVENT.showElementDetails]: <BuildingDetails />,
    [PLANNING_EVENT.editElementDetails]: <BuildingForm />,
    ViewLayer: BuildingViewLayer,
    Geometry: BuildingGeometry,
    Icon: BuildingIcon,
  },
  [SAreaKey]: {
    [PLANNING_EVENT.addElement]: <SAreaAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <SAreaEditMapLayer />,
    [PLANNING_EVENT.showElementForm]: <SAreaForm />,
    [PLANNING_EVENT.showElementDetails]: <SAreaDetails />,
    [PLANNING_EVENT.editElementDetails]: <SAreaForm />,
    ViewLayer: SAreaViewLayer,
    Geometry: SAreaGeometry,
    Icon: SAreaIcon,
  },
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = orderBy(serverData, ["id"], ["desc"]);

  // PolyLine / Polygon
  if (
    layerKey === CableKey ||
    layerKey === SAreaKey ||
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
    layerKey === DpKey ||
    layerKey === SplitterKey ||
    layerKey === BuildingKey
  ) {
    resultData.map((d) => {
      d.geometry = [...d.coordinates];
      d.coordinates = coordsToLatLongMap([d.coordinates])[0];
    });
    return resultData;
  }
  // Multi polygon - regions
  else if (layerKey === RegionKey) {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
};
