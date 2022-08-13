import cloneDeep from "lodash/cloneDeep";

import { ViewLayer as RegionViewLayer } from "./layers/region";

import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";

export const getLayerCompFromKey = (layerKey) => {
  switch (layerKey) {
    case "region":
      return <RegionViewLayer key={layerKey} />;

    case "p_dp":
      return <></>;

    default:
      return null;
  }
};

export const covertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];

  // hard coded layers
  if (layerKey === "region") {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // dynamic gis layers
  else if (layerKey === "p_dp") {
    resultData.map((d) => {
      d.geometry = coordsToLatLongMap([d.geometry])[0];
    });
    return resultData;
  }
};
