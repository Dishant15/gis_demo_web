import { createSlice } from "@reduxjs/toolkit";
import get from "lodash/get";
import has from "lodash/has";
import size from "lodash/size";

import { fetchLayerDataThunk } from "./actionBar.services";
import { handleLayerSelect, removeLayerSelect } from "./planningState.reducer";
import { covertLayerServerData } from "../GisMap/utils";
import { fetchTicketWorkorderDataThunk } from "./ticket.services";
import { cloneDeep } from "lodash";

const defaultLayerNetworkState = {
  isLoading: false,
  isFetched: false,
  isError: false,
  isSelected: false,
  count: 0,
};

const initialState = {
  // shape : { layer-key: { ...defaultLayerNetworkState } }
  layerNetworkState: {},
  // shape : { layer-key: { viewData: [], editData: {} } }
  layerData: {},
  // shape: { event: "addElement" | "editElement", data: { **Edit / init form data }, layerKey }
  mapState: {},
  // ticket related fields
  ticketId: null,
  // shape : { **Network state, **ticket fields, area_pocket: {},
  //          work_orders: [ {**WorkOrder fields, element }, ... ] }
  ticketData: {
    isLoading: false,
    isFetched: false,
    isError: false,
  },
  // list of elements that can be shown on map with converted data
  ticketGisData: [],
};

const planningGisSlice = createSlice({
  name: "planningGis",
  initialState,
  reducers: {
    // payload: ticketId ( Number ) | null
    setTicketId: (state, { payload }) => {
      state.ticketId = payload;
    },
    setMapState: (state, { payload }) => {
      state.mapState = { ...payload };
    },
    updateMapStateData: (state, { payload }) => {
      const mapStateData = get(state.mapState, "data", {});
      state.mapState.data = { ...mapStateData, ...payload };
    },
  },
  extraReducers: {
    // payload : layerKey
    [handleLayerSelect]: (state, { payload }) => {
      if (has(state, ["layerNetworkState", payload])) {
        state.layerNetworkState[payload].isSelected = true;
      }
    },
    [removeLayerSelect]: (state, { payload }) => {
      if (has(state, ["layerNetworkState", payload])) {
        state.layerNetworkState[payload].isSelected = false;
      }
    },
    // start loading
    [fetchLayerDataThunk.pending]: (state, action) => {
      const layerKey = get(action, "meta.arg.layerKey", "");
      if (has(state, ["layerNetworkState", layerKey])) {
        state.layerNetworkState[layerKey].isLoading = true;
        state.layerNetworkState[layerKey].isSelected = true;
      } else {
        // initialise new layer
        state.layerNetworkState[layerKey] = {
          ...defaultLayerNetworkState,
          isLoading: true,
          isSelected: true,
        };
        state.layerData[layerKey] = {
          viewData: [],
          editData: {},
        };
      }
      // if layerKey is region, region changed
      // clear data for all unselected layers
      // create list of layerKeys for all un selected layers
      // loop over and reset data
    },
    // fetch success
    [fetchLayerDataThunk.fulfilled]: (state, action) => {
      const layerKey = get(action, "meta.arg.layerKey", "");
      state.layerNetworkState[layerKey].isLoading = false;
      state.layerNetworkState[layerKey].isFetched = true;
      state.layerNetworkState[layerKey].count = size(action.payload);
      // convert payload coordinates into google coordinates data
      state.layerData[layerKey].viewData = covertLayerServerData(
        layerKey,
        action.payload
      );
    },
    // handle error
    [fetchLayerDataThunk.rejected]: (state, action) => {
      const layerKey = get(action, "meta.arg.layerKey", "");
      state.layerNetworkState[layerKey].isError = true;
    },
    [fetchTicketWorkorderDataThunk.pending]: (state, action) => {
      state.ticketData.isLoading = true;
      state.ticketData.isError = false;
    },
    [fetchTicketWorkorderDataThunk.rejected]: (state, action) => {
      state.ticketData.isLoading = false;
      state.ticketData.isFetched = true;
      state.ticketData.isError = true;
    },
    [fetchTicketWorkorderDataThunk.fulfilled]: (state, action) => {
      let ticketGisData = cloneDeep(action.payload);
      // convert ticket gis data into google coordinate data
      for (
        let tg_ind = 0;
        tg_ind < ticketGisData.work_orders.length;
        tg_ind++
      ) {
        const currWO = ticketGisData.work_orders[tg_ind];
        if (currWO.element?.id) {
          // delete type WO may not have element
          currWO.element = covertLayerServerData(currWO.layer_key, [
            currWO.element,
          ])[0];
        }
      }
      state.ticketData = ticketGisData;
      state.ticketData.isLoading = false;
      state.ticketData.isFetched = true;
      state.ticketData.isError = false;
    },
  },
});

export const { setTicketId, setMapState, updateMapStateData } =
  planningGisSlice.actions;
export default planningGisSlice.reducer;
