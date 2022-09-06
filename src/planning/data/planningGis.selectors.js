import { createSelector } from "@reduxjs/toolkit";
import get from "lodash/get";

export const getAllLayersNetworkStatus = (store) =>
  store.planningGis.layerNetworkState;
export const getAllLayersData = (store) => store.planningGis.layerData;

export const getLayerNetworkState = (layerKey) =>
  createSelector(getAllLayersNetworkStatus, (layerNetworkState) =>
    get(layerNetworkState, layerKey, {})
  );

export const getLayerViewData = (layerKey) =>
  createSelector(getAllLayersData, (layerData) => get(layerData, layerKey, {}));

// ticket selectors

export const getPlanningTicketId = (store) => store.planningGis.ticketId;
export const getPlanningTicketNetworkStatus = (store) => ({
  isLoading: store.planningGis.ticketData.isLoading,
  isFetched: store.planningGis.ticketData.isFetched,
  isError: store.planningGis.ticketData.isError,
});

export const getPlanningTicketData = (store) => store.planningGis.ticketData;
