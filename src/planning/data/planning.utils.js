import {
  point,
  lineString,
  polygon,
  multiPolygon,
  booleanIntersects,
} from "@turf/turf";
import indexOf from "lodash/indexOf";

import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import last from "lodash/last";

import { FEATURE_TYPES } from "planning/GisMap/layers/common/configuration";
import { LayerKeyMappings } from "planning/GisMap/utils";

export const filterGisDataByPolygon = ({
  filterPolygon,
  gisData,
  whiteList = [],
  blackList = [],
}) => {
  const elementResultList = [];
  // loop over layerData
  const layerKeyList = Object.keys(gisData);
  // check intersects
  for (let lkInd = 0; lkInd < layerKeyList.length; lkInd++) {
    const currLayerKey = layerKeyList[lkInd];
    // don't filter if not in whitelist
    if (size(whiteList) && indexOf(whiteList, currLayerKey) === -1) continue;
    // don't filter if in blackList
    if (size(blackList) && indexOf(blackList, currLayerKey) !== -1) continue;
    const currLayerData = gisData[currLayerKey];
    const featureType = LayerKeyMappings[currLayerKey]["featureType"];

    for (let elemInd = 0; elemInd < currLayerData.length; elemInd++) {
      const element = currLayerData[elemInd];
      // create turf geom for each element
      let turfGeom;
      if (featureType === FEATURE_TYPES.POINT) {
        turfGeom = point(element.geometry);
      } else if (featureType === FEATURE_TYPES.POLYLINE) {
        turfGeom = lineString(element.geometry);
      } else if (featureType === FEATURE_TYPES.POLYGON) {
        turfGeom = polygon([element.geometry]);
      } else {
        // multi polygon
        turfGeom = multiPolygon(element.geometry);
      }
      // check intersects
      const isIntersecting = booleanIntersects(filterPolygon, turfGeom);
      // add to list if intersect true
      if (isIntersecting) {
        elementResultList.push({
          ...element,
          layerKey: currLayerKey,
        });
      }
    }
  }

  return elementResultList;
};

/**
 * generate network_id using parent data and region list
 * parents : { layerKey : [{id, name, uid, netid}, ... ], ...]
 */
export const generateNetworkIdFromParent = (uniqueId, parents, regionList) => {
  let networkId = "";
  if (isEmpty(parents)) {
    // get region uid
    const reg_uid = !!size(regionList) ? last(regionList).unique_id : "RGN";
    networkId = `${reg_uid}-${uniqueId}`;
  } else {
    // generate network id from parent list, get first key
    const firstLayerKey = Object.keys(parents)[0];
    const parentNetId = get(parents, [firstLayerKey, "0", "network_id"], "PNI");
    networkId = `${parentNetId}-${uniqueId}`;
  }
  return networkId;
};
