import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";

export const getAllLayersNetworkStatus = (store) =>
  store.planningGis.layerNetworkState;

export const getLayerNetworkState = (layerKey) =>
  createSelector(getAllLayersNetworkStatus, (layerNetworkState) =>
    get(layerNetworkState, layerKey, {})
  );
