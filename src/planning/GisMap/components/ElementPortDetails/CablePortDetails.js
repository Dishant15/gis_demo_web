import React from "react";

import Box from "@mui/material/Box";

import PortList from "./PortList";

const tableConfig = [
  {
    label: "Sr No",
    key: "sr_no",
  },
  {
    label: "Name",
    key: "common_name",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Tube Color",
    key: "tube_color",
    type: "color",
  },
  {
    label: "Fiber Color",
    key: "fiber_color",
    type: "color",
  },
  {
    label: "A End",
    key: "conn__to_A_end",
    type: "port_number",
  },
  {
    label: "B End",
    key: "conn__to_B_end",
    type: "port_number",
  },
];

/**
 * Parent:
 *    ElementPortDetails
 */
const CablePortDetails = ({ portDetails }) => {
  return (
    <Box p={1}>
      <PortList portList={portDetails} tableConfig={tableConfig} />
    </Box>
  );
};

export default CablePortDetails;
