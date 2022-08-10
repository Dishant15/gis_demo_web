import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const initialState = {
  // 0: region, 1: Layers, 2: Add Element
  activeTab: 0,
  // list of region ids
  selectedRegionIds: [],
  expandedRegionIds: [],
  // list of layer keys
  selectedLayerKeys: [],
  loadingLayerKeys: [],
};

const planningStateSlice = createSlice({
  name: "planningState",
  initialState,
  reducers: {
    // payload: selected tab index
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    // payload : regionIdList
    handleRegionSelect: (state, { payload }) => {
      state.selectedRegionIds = payload;
    },
    // payload : regionId
    handleRegionExpand: (state, { payload }) => {
      // if regionId in state remove
      const regSearchInd = state.expandedRegionIds.indexOf(payload);
      if (regSearchInd > -1) {
        state.expandedRegionIds.splice(regSearchInd, 1);
      } else {
        state.expandedRegionIds.push(payload);
      }
    },
    // payload : layer key
    handleLayerSelect: (state, { payload }) => {
      // if regionId in state remove
      const layerSerchInd = state.selectedLayerKeys.indexOf(payload);
      if (layerSerchInd > -1) {
        state.selectedLayerKeys.splice(layerSerchInd, 1);
      } else {
        state.selectedLayerKeys.push(payload);
      }
    },
  },
});

export const {
  setActiveTab,
  handleRegionSelect,
  handleRegionExpand,
  handleLayerSelect,
} = planningStateSlice.actions;
export default planningStateSlice.reducer;
