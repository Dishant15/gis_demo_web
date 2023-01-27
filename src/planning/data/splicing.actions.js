import size from "lodash/size";
import get from "lodash/get";

import { addNotification } from "redux/reducers/notification.reducer";
import {
  postAddPortConnectionThunk,
  postRemovePortConnectionThunk,
} from "./port.services";
import { resetSelectedPorts, setSelectedPorts } from "./splicing.reducer";
import { getSplicingSelectedPorts } from "./splicing.selectors";
import { find } from "lodash";

const convertPortDataToAddConnection = (portData) => {
  const [fromPort, toPort] = portData;
  // create [from, to] data to post to server
  // port_id, layer key belongs to port that needs to update
  // other fields are from connecting port, different than port id
  return [
    {
      port_id: fromPort.id,
      elem_layer_key: fromPort.elem_layer_key,
      connected_to: toPort.element_unique_id,
      connected_port_id: toPort.id,
      connected_elem_id: toPort.element,
    },
    {
      port_id: toPort.id,
      elem_layer_key: toPort.elem_layer_key,
      connected_to: fromPort.element_unique_id,
      connected_port_id: fromPort.id,
      connected_elem_id: fromPort.element,
    },
  ];
};

export const handleConnectionAdd =
  (selectedPort, elem_layer_key) => (dispatch, getState) => {
    const storeState = getState();
    const selectedPorts = getSplicingSelectedPorts(storeState);
    if (!size(selectedPorts)) {
      // add port to selection if first click
      dispatch(setSelectedPorts({ ...selectedPort, elem_layer_key }));
    } else {
      const firstPort = selectedPorts[0];
      // check if second selected port is valid
      if (
        firstPort.is_input === selectedPort.is_input ||
        firstPort.element === selectedPort.element
      ) {
        dispatch(
          addNotification({
            type: "error",
            title: "Invalid port selected",
            text: "Can not connect ports you have selected",
          })
        );
        dispatch(resetSelectedPorts());
        return;
      }
      const secondPort = { ...selectedPort, elem_layer_key };
      dispatch(setSelectedPorts(secondPort));
      // call mutation to create connection
      const addConnectionPostData = convertPortDataToAddConnection([
        firstPort,
        secondPort,
      ]);

      dispatch(
        postAddPortConnectionThunk({ connection: [addConnectionPostData] })
      );
    }
  };

export const handleConnectionRemove =
  (port_id, port_layer_key) => (dispatch) => {
    dispatch(postRemovePortConnectionThunk({ port_id, port_layer_key }));
  };

// connect all the port from left side cable to right side cable
// fromData | toData shape : {layer_key, ports, sr_no: [start, end]}
export const handleThroughConnect =
  (fromData, toData, connectionCount) => (dispatch) => {
    const fromPorts = fromData.ports;
    // get the start sr no of cable
    let fromInd = get(fromData, "sr_no.0");
    // const fromLastInd = get(fromData, "sr_no.1");
    const toPorts = toData.ports;
    let toInd = get(toData, "sr_no.0");
    const toLastInd = get(toData, "sr_no.1");

    const finalPortConnectionData = [];

    let loopInd = 0;
    while (loopInd <= connectionCount) {
      // find from port
      const matchedFrPort = find(fromPorts, {
        sr_no: fromInd,
        is_input: false,
      });
      if (!matchedFrPort) {
        // port not found wrong serial no
        dispatch(
          addNotification({
            type: "error",
            title: "Invalid port selection",
            text: `Sr No ${fromInd} not found in FROM element`,
          })
        );
        return;
      }
      // find to port
      const matchedToPort = find(toPorts, { sr_no: toInd, is_input: true });
      if (!matchedToPort) {
        // port not found wrong serial no
        dispatch(
          addNotification({
            type: "error",
            title: "Invalid port selection",
            text: `Sr No ${toInd} not found in TO element`,
          })
        );
        return;
      }
      // check if both are vacant
      if (matchedFrPort.status === "C" || matchedToPort.status === "C") {
        dispatch(
          addNotification({
            type: "error",
            title: "Invalid port selection",
            text: "Selected ports are already CONNECTED",
          })
        );
        return;
      }
      // create connection data
      const addConnectionPostData = convertPortDataToAddConnection([
        { ...matchedFrPort, elem_layer_key: fromData.layer_key },
        { ...matchedToPort, elem_layer_key: toData.layer_key },
      ]);

      loopInd += 1;
      fromInd += 1;
      toInd += 1;

      finalPortConnectionData.push([...addConnectionPostData]);
    }

    dispatch(
      postAddPortConnectionThunk({ connection: finalPortConnectionData })
    );
  };
