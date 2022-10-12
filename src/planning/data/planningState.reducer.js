import { createSlice } from "@reduxjs/toolkit";
import get from "lodash/get";

import { logout } from "redux/reducers/auth.reducer";

const initialState = {
  // 0: region, 1: Layers, 2: Add Element
  activeTab: 0,
  // list of region ids
  selectedRegionIds: [],
  expandedRegionIds: [],
  // list of layer keys
  selectedLayerKeys: [],
  loadingLayerKeys: [],
  // when user go to add element tab fetch all config options
  // select default options and set as selectedConfigurations
  // shape: { layerKey: [ config1, config2, ...], ... }
  layerConfigurations: {},
  // shape: { layerKey: { **configuration data }, ...}
  selectedConfigurations: {},
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
      state.selectedLayerKeys.push(payload);
    },
    removeLayerSelect: (state, { payload }) => {
      const layerSerchInd = state.selectedLayerKeys.indexOf(payload);
      if (layerSerchInd > -1) {
        state.selectedLayerKeys.splice(layerSerchInd, 1);
      }
    },
    // payload : { layerKey, configurationList }
    setLayerConfigurations: (state, { payload }) => {
      state.layerConfigurations[payload.layerKey] = [
        ...payload.configurationList,
      ];
    },
    // payload : { layerKey, configuration }
    selectConfiguration: (state, { payload }) => {
      state.selectedConfigurations[payload.layerKey] = payload.configuration;
    },
  },
  extraReducers: {
    [logout]: () => {
      return initialState;
    },
  },
});

export const {
  setActiveTab,
  handleRegionSelect,
  handleRegionExpand,
  handleLayerSelect,
  removeLayerSelect,
  setLayerConfigurations,
  selectConfiguration,
} = planningStateSlice.actions;
export default planningStateSlice.reducer;
