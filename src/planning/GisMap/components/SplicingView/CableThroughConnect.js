import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import trim from "lodash/trim";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { handleThroughConnect } from "planning/data/splicing.actions";
import { addNotification } from "redux/reducers/notification.reducer";
import ConfirmDialog from "components/common/ConfirmDialog";

const CableThroughConnect = ({ fromData, toData }) => {
  const dispatch = useDispatch();
  // calculate max sr no for from and to
  let fromMax =
    fromData.configuration.no_of_tube * fromData.configuration.core_per_tube;
  if (!!fromData.configuration.ribbon_count) {
    fromMax = fromMax * fromData.configuration.ribbon_count;
  }
  let toMax =
    toData.configuration.no_of_tube * toData.configuration.core_per_tube;
  if (!!toData.configuration.ribbon_count) {
    toMax = toMax * toData.configuration.ribbon_count;
  }

  const [showPopup, setShowPopup] = useState(false);
  const [fromStart, setFromStart] = useState(1);
  const [fromEnd, setFromEnd] = useState(fromMax);
  const [toStart, setToStart] = useState(1);
  const [toEnd, setToEnd] = useState(toMax);

  const onChangeMapper = {
    setFromStart,
    setFromEnd,
    setToStart,
    setToEnd,
  };

  const handleTextUpdates = useCallback(
    (handlerName) => (e) => {
      const val = trim(e.target.value);
      // allow numeric only
      if (isNaN(val)) return;
      // check min max validations
      onChangeMapper[handlerName](val);
    },
    [onChangeMapper]
  );

  const handleShowPopup = () => {
    const connectionCount = Number(fromEnd) - Number(fromStart);
    const validateCount = Number(toEnd) - Number(toStart);
    if (validateCount !== connectionCount) {
      dispatch(
        addNotification({
          type: "error",
          title: "Invalid port selection",
          text: "From port and To port counts must be same",
        })
      );
      return;
    }
    setShowPopup(true);
  };

  const handleHidePopup = useCallback(() => setShowPopup(false), []);

  const handleConnectClick = () => {
    const connectionCount = Number(fromEnd) - Number(fromStart);
    const fromConnData = {
      layer_key: fromData.layer_key,
      ports: fromData.ports,
      sr_no: [Number(fromStart), Number(fromEnd)],
    };
    const toConnData = {
      layer_key: toData.layer_key,
      ports: toData.ports,
      sr_no: [Number(toStart), Number(toEnd)],
    };

    dispatch(handleThroughConnect(fromConnData, toConnData, connectionCount));
    handleHidePopup();
  };

  return (
    <>
      <Stack spacing={15} direction="row">
        <Stack direction="row" spacing={2}>
          <Box display="flex" alignItems="center">
            <Typography>From</Typography>
          </Box>
          <TextField
            label="start"
            value={fromStart}
            onChange={handleTextUpdates("setFromStart")}
          />
          <TextField
            label="end"
            value={fromEnd}
            onChange={handleTextUpdates("setFromEnd")}
          />
        </Stack>

        <Button onClick={handleShowPopup}>Connect</Button>

        <Stack direction="row" spacing={2}>
          <Box display="flex" alignItems="center">
            <Typography>To</Typography>
          </Box>
          <TextField
            label="start"
            value={toStart}
            onChange={handleTextUpdates("setToStart")}
          />
          <TextField
            label="end"
            value={toEnd}
            onChange={handleTextUpdates("setToEnd")}
          />
        </Stack>
      </Stack>
      <ConfirmDialog
        show={!!showPopup}
        onClose={handleHidePopup}
        onConfirm={handleConnectClick}
        title="Confirm !!"
        text="Are you sure ?"
        confirmText="Connect"
      />
    </>
  );
};

export default CableThroughConnect;
