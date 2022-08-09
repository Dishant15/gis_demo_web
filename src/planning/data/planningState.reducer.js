import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const initialState = {
  // 0: region, 1: Layers, 2: Add Element
  activeTab: 0,
  // list of region ids
  selectedRegionIds: [],
  expandedRegionIds: [],
};

const planningStateSlice = createSlice({
  name: "planningState",
  initialState,
  reducers: {
    // payload: selected tab index
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    // payload : regionId
    handleRegionSelect: (state, { payload }) => {
      // if regionId in state remove
      const regSearchInd = state.selectedRegionIds.indexOf(payload);
      if (regSearchInd > -1) {
        state.selectedRegionIds.splice(regSearchInd, 1);
      } else {
        state.selectedRegionIds.push(payload);
      }
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
  },
});

export const { setActiveTab, handleRegionSelect, handleRegionExpand } =
  planningStateSlice.actions;
export default planningStateSlice.reducer;
