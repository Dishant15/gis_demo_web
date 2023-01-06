import React from "react";

import filter from "lodash/filter";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PortList from "./PortList";

const tableConfig = [
  {
    label: "Sr No",
    key: "sr_no",
  },
  {
    label: "Port",
    key: "name",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Port Type",
    key: "port_type",
  },
  {
    label: "Capacity (Gb/s)",
    key: "capacity",
  },
  {
    label: "Connection",
    key: "connected_to",
    type: "port_number",
  },
];

/**
 * Parent:
 *    ElementPortDetails
 */
const OltPortDetails = ({ portDetails }) => {
  const inputList = filter(portDetails, ["is_input", true]);
  const outputList = filter(portDetails, ["is_input", false]);
  return (
    <Box px={1} pb={1}>
      <Typography variant="h6" py={1}>
        Uplink ports
      </Typography>
      <PortList portList={inputList} tableConfig={tableConfig} />
      <Typography variant="h6" py={1}>
        Downlink ports
      </Typography>
      <PortList portList={outputList} tableConfig={tableConfig} />
    </Box>
  );
};

export default OltPortDetails;
