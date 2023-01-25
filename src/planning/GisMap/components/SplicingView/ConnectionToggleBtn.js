import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import {
  handleConnectionAdd,
  handleConnectionRemove,
} from "planning/data/splicing.actions";
import { getFirstSelectedPort } from "planning/data/splicing.selectors";
import { connectionDotStyles } from "./style.constants";

const ConnectionToggleBtn = ({ portData, layer_key }) => {
  const dispatch = useDispatch();

  const selectedPort = useSelector(getFirstSelectedPort);
  const { status, id, is_input, element } = portData;

  const onAddConnectionClick = useCallback(
    (port) => () => {
      dispatch(handleConnectionAdd(port, layer_key));
    },
    [layer_key]
  );

  const onRemoveConnectionClick = useCallback(
    (port_id) => () => {
      dispatch(handleConnectionRemove(port_id, layer_key));
    },
    [layer_key]
  );

  if (status === "C") {
    // if port is connected show disconnect btn
    return (
      <Box
        display="flex"
        sx={connectionDotStyles(is_input)}
        onClick={onRemoveConnectionClick(id)}
      >
        <HighlightOffIcon fontSize="small" />
      </Box>
    );
  } else {
    // if port is vacant / reserved / faulty show connect btn
    return (
      <Box
        display="flex"
        sx={connectionDotStyles(is_input)}
        onClick={onAddConnectionClick(portData)}
      >
        {selectedPort.id === id && selectedPort.element === element ? ( // check if this port is selected
          <RadioButtonCheckedIcon fontSize="small" />
        ) : (
          <CircleIcon fontSize="small" />
        )}
      </Box>
    );
  }
};

export default ConnectionToggleBtn;
