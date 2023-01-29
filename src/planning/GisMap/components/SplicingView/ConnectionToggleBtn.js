import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ConfirmDialog from "components/common/ConfirmDialog";

import {
  handleConnectionAdd,
  handleConnectionRemove,
} from "planning/data/splicing.actions";
import { getFirstSelectedPort } from "planning/data/splicing.selectors";
import { connectionDotStyles } from "./style.constants";

const ConnectionToggleBtn = ({ portData, layer_key }) => {
  const dispatch = useDispatch();
  // show delete popup based on this flag
  const [selectedPortId, setSelectedPortId] = useState(null);

  const selectedPort = useSelector(getFirstSelectedPort);
  const { status, id, element_unique_id, is_input, element } = portData;

  const onAddConnectionClick = useCallback(
    (port) => () => {
      dispatch(handleConnectionAdd(port, layer_key));
    },
    [layer_key]
  );

  const onRemoveConnectionClick = useCallback(() => {
    dispatch(handleConnectionRemove(selectedPortId, layer_key));
    handleHidePopup();
  }, [layer_key, selectedPortId]);

  const handleShowPopup = useCallback(
    (port_id) => () => setSelectedPortId(port_id),
    []
  );
  const handleHidePopup = useCallback(() => setSelectedPortId(null), []);

  if (status === "C") {
    // if port is connected show disconnect btn
    return (
      <>
        <Box
          id={element_unique_id}
          display="flex"
          sx={connectionDotStyles(is_input)}
          onClick={handleShowPopup(id)}
        >
          <HighlightOffIcon fontSize="small" />
        </Box>
        <ConfirmDialog
          show={!!selectedPortId}
          onClose={handleHidePopup}
          onConfirm={onRemoveConnectionClick}
          title="Disconnect Port"
          text="Are you sure you want to remove connection of this port ?"
          confirmText="Remove"
        />
      </>
    );
  } else {
    // if port is vacant / reserved / faulty show connect btn
    return (
      <Box
        id={element_unique_id}
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
