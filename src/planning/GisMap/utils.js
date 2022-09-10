import cloneDeep from "lodash/cloneDeep";

import {
  ViewLayer as RegionViewLayer,
  LAYER_KEY as RegionKey,
} from "./layers/region";
import {
  ViewLayer as DPViewLayer,
  AddLayer as DPAddLayer,
  Geometry as DPGeometry,
  LAYER_KEY as DpKey,
  ElementForm as DpForm,
  Icon as DpIcon,
} from "./layers/p_dp";
import {
  ViewLayer as SplitterLayer,
  Geometry as SplitterGeometry,
  LAYER_KEY as SplitterKey,
  getIcon as SplitterGetIcon,
  ELEMENT_CONFIG_TEMPLATE as SplitterConfigFormTemplate,
  INITIAL_CONFIG_DATA as SplitterConfigInitData,
} from "./layers/p_splitter";

import { coordsToLatLongMap } from "utils/map.utils";

export const MAP_STATE = {
  addElement: "A",
  editElement: "E",
  showElementForm: "F",
};

export const LayerKeyMappings = {
  [DpKey]: {
    [MAP_STATE.addElement]: <DPAddLayer />,
    [MAP_STATE.showElementForm]: <DpForm />,
    Icon: DpIcon,
  },
  [SplitterKey]: {
    // [MAP_STATE.addElement]: AddMarkerLayer,
    Icon: SplitterGetIcon,
    ConfigFormTemplate: SplitterConfigFormTemplate,
    ConfigInitData: SplitterConfigInitData,
  },
};

export const getLayerCompFromKey = (layerKey) => {
  switch (layerKey) {
    case RegionKey:
      return <RegionViewLayer key={layerKey} />;

    case DpKey:
      return <DPViewLayer key={layerKey} />;

    case SplitterKey:
      return <SplitterLayer key={layerKey} />;

    default:
      return null;
  }
};

export const getGeometryFromKey = (props) => {
  switch (props.layer_key) {
    // case RegionKey:
    //   return <RegionViewLayer key={layerKey} />;

    case DpKey:
      return <DPGeometry {...props} />;

    case SplitterKey:
      return <SplitterGeometry {...props} />;

    default:
      return null;
  }
};

export const covertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];

  // hard coded layers
  if (layerKey === RegionKey) {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
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
};
