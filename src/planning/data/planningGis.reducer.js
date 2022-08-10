import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { fetchLayerDataThunk } from "./actionBar.services";

const initialState = {
  // shape : { layer-key: { isLoading, } }
  layerNetworkState: {
    region: {
      isLoading: false,
      isFetched: false,
      isError: false,
    },
  },
  layerData: {
    region: [],
  },
};

const planningGisSlice = createSlice({
  name: "planningGis",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchLayerDataThunk.fulfilled]: (state, action) => {
      const layerKey = get(action, "meta.arg.layerKey", "");
      state.layerNetworkState[layerKey].isLoading = false;
      state.layerNetworkState[layerKey].isFetched = true;
    },
    [fetchLayerDataThunk.pending]: (state, action) => {
      const layerKey = get(action, "meta.arg.layerKey", "");
      state.layerNetworkState[layerKey].isLoading = true;
    },
    [fetchLayerDataThunk.rejected]: (state, action) => {
      const layerKey = get(action, "meta.arg.layerKey", "");
      state.layerNetworkState[layerKey].isError = true;
    },
  },
});

export default planningGisSlice.reducer;
