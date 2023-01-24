import { postAddPortConnectionThunk } from "./port.services";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  // elements
  left: null,
  right: null,
  middle: null,
  // selection data
  selectedPorts: [],
  // network states
  addConnectionLoading: false,
  addConnectionError: null,
};

const splicingSlice = createSlice({
  name: "splicing",
  initialState,
  reducers: {
    setElement: (state, { payload }) => {
      state[payload.side] = { ...payload.element };
    },
    // payload : {...user selected portData, elem_layer_key}
    setSelectedPorts: (state, { payload }) => {
      state.selectedPorts.push({ ...payload });
    },
    resetSelectedPorts: (state) => {
      state.selectedPorts = [];
    },
  },
  extraReducers: {
    [postAddPortConnectionThunk.pending]: (state) => {
      state.addConnectionLoading = true;
    },
    // payload => res from add connection success, shape: [ port1, port2 ]
    [postAddPortConnectionThunk.fulfilled]: (state, { payload }) => {
      // reset selected ports
      state.selectedPorts = [];
      state.addConnectionLoading = false;
      for (let pInd = 0; pInd < payload.length; pInd++) {
        const newPort = payload[pInd];
        // find which element has this port
        let updateElement;
        if (!!state.left && state.left.id == newPort.element) {
          updateElement = state.left;
        } else if (!!state.right && state.right.id == newPort.element) {
          updateElement = state.right;
        } else if (!!state.middle && state.middle.id == newPort.element) {
          updateElement = state.middle;
        }
        // find port that needs to update
        const matchingPortIndex = updateElement.ports.findIndex(
          (p) => p.id === newPort.id
        );
        if (matchingPortIndex !== -1) {
          updateElement.ports[matchingPortIndex] = { ...newPort };
        }
      }
    },
    [postAddPortConnectionThunk.rejected]: (state, { error }) => {
      console.log("🚀 ~ file: splicing.reducer.js:66 ~ error", error);
      state.addConnectionLoading = false;
      state.addConnectionError = true;
    },
  },
});

export const { setElement, setSelectedPorts, resetSelectedPorts } =
  splicingSlice.actions;
export default splicingSlice.reducer;
