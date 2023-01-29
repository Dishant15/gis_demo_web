import { reject } from "lodash";
import get from "lodash/get";
import {
  postAddPortConnectionThunk,
  postRemovePortConnectionThunk,
} from "./port.services";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  // elements
  left: null,
  right: null,
  middle: null,
  // selection data
  selectedPorts: [],
  // shape : [ {connType: new | old, elem1, elem2}]
  connections: [],
  // network states
  portUpdateLoading: false,
  portUpdateError: null,
};

const updatePortsFromPayload = (state, payload) => {
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
    if (!!updateElement) {
      // find port that needs to update
      const matchingPortIndex = updateElement.ports.findIndex(
        (p) => p.id === newPort.id
      );
      if (matchingPortIndex !== -1) {
        updateElement.ports[matchingPortIndex] = { ...newPort };
      }
    }
  }
};

const addConnectionFromPayload = (state, payload) => {
  for (let pInd = 0; pInd < payload.length; pInd++) {
    const { is_input, element_unique_id, connected_to } = payload[pInd];
    // create connection from all input ports
    if (is_input) {
      state.connections.push({
        connType: "new",
        elem1: connected_to,
        elem2: element_unique_id,
      });
    }
  }
};

const removeConnectionFromPayload = (state, payload) => {
  let newConnections = [...state.connections];
  for (let pInd = 0; pInd < payload.length; pInd++) {
    const { is_input, element_unique_id } = payload[pInd];
    // find and remove
    if (is_input) {
      newConnections = reject(newConnections, { elem2: element_unique_id });
    }
  }
  state.connections = newConnections;
};

const splicingSlice = createSlice({
  name: "splicing",
  initialState,
  reducers: {
    // payload : { left, right, middle }
    setSplicingElements: (state, { payload }) => {
      state.left = get(payload, "left", null);
      state.right = get(payload, "right", null);
      state.middle = get(payload, "middle", null);
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
      state.portUpdateLoading = true;
      state.portUpdateError = null;
    },
    // payload => res from add connection success, shape: [ port1, port2 ]
    [postAddPortConnectionThunk.fulfilled]: (state, { payload }) => {
      // reset selected ports
      state.selectedPorts = [];
      state.portUpdateLoading = false;
      state.portUpdateError = null;
      updatePortsFromPayload(state, payload);
      addConnectionFromPayload(state, payload);
    },
    [postAddPortConnectionThunk.rejected]: (state, { error }) => {
      console.log("🚀 ~ file: splicing.reducer.js:66 ~ error", error);
      state.portUpdateLoading = false;
      state.portUpdateError = true;
    },
    [postRemovePortConnectionThunk.pending]: (state) => {
      state.portUpdateLoading = true;
      state.portUpdateError = null;
    },
    [postRemovePortConnectionThunk.fulfilled]: (state, { payload }) => {
      state.selectedPorts = [];
      state.portUpdateLoading = false;
      state.portUpdateError = null;
      updatePortsFromPayload(state, payload);
      removeConnectionFromPayload(state, payload);
    },
    [postRemovePortConnectionThunk.rejected]: (state, { error }) => {
      console.log("🚀 ~ file: splicing.reducer.js:107 ~ error", error);
      state.portUpdateLoading = false;
      state.portUpdateError = true;
    },
  },
});

export const { setSplicingElements, setSelectedPorts, resetSelectedPorts } =
  splicingSlice.actions;
export default splicingSlice.reducer;
