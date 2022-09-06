import cloneDeep from "lodash/cloneDeep";

import {
  ViewLayer as RegionViewLayer,
  LAYER_KEY as RegionKey,
} from "./layers/region";
import {
  ViewLayer as DPViewLayer,
  Geometry as DPGeometry,
  LAYER_KEY as DpKey,
} from "./layers/p_dp";
import {
  ViewLayer as SplitterLayer,
  Geometry as SplitterGeometry,
  LAYER_KEY as SplitterKey,
} from "./layers/p_splitter";

import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";

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

export const getGeometryFromKey = (id, layerKey, coordinates) => {
  switch (layerKey) {
    // case RegionKey:
    //   return <RegionViewLayer key={layerKey} />;

    case DpKey:
      return <DPGeometry key={id} coordinates={coordinates} />;

    case SplitterKey:
      return <SplitterGeometry key={id} coordinates={coordinates} />;

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
