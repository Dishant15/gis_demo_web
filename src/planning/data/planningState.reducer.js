import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const initialState = {
  // 0: region, 1: Layers, 2: Add Element
  activeTab: 0,
};

const planningStateSlice = createSlice({
  name: "planningState",
  initialState,
  reducers: {
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
  },
});

export const { setActiveTab } = planningStateSlice.actions;
export default planningStateSlice.reducer;
