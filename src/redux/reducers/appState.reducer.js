import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  headerHeight: 64,
  contentHeight: window.innerHeight - 64,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setWindowSize: (state) => {
      state.windowWidth = window.innerWidth;
      state.windowHeight = window.innerHeight;
      state.contentHeight = window.innerHeight - initialState.headerHeight;
    },
  },
});

export const { setWindowSize } = appStateSlice.actions;
export default appStateSlice.reducer;
