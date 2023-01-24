import size from "lodash/size";
import { addNotification } from "redux/reducers/notification.reducer";
import { postAddPortConnectionThunk } from "./port.services";
import { resetSelectedPorts, setSelectedPorts } from "./splicing.reducer";
import { getSplicingSelectedPorts } from "./splicing.selectors";

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
        postAddPortConnectionThunk({ connection: addConnectionPostData })
      );
    }
  };
