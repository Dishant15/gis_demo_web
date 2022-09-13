import cloneDeep from "lodash/cloneDeep";

import {
  ViewLayer as RegionViewLayer,
  LAYER_KEY as RegionKey,
} from "./layers/region";
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

import { coordsToLatLongMap } from "utils/map.utils";

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElement: "A",
  editElementLocation: "E",
  showElementForm: "F",
  showElementDetails: "D",
  editElementDetails: "EF",
};

export const LayerKeyMappings = {
  [RegionKey]: {
    ViewLayer: RegionViewLayer,
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
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];

  // PolyLine
  if (layerKey === CableKey) {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // Point gis layer
  else if (layerKey === DpKey || layerKey === SplitterKey) {
    resultData.map((d) => {
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
