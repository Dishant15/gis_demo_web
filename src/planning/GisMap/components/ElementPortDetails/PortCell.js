import React from "react";

import TableCell from "@mui/material/TableCell";

/**
 * Parent:
 *    CablePortDetails
 */
const PortCell = ({ value }) => {
  return <TableCell>{value || "Not Connected"}</TableCell>;
};

export default PortCell;
