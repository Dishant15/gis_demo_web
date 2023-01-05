import React from "react";

import get from "lodash/get";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import PortCell from "./PortCell";

import { FIBER_COLOR_CODE_HEX_MAPPING } from "./port.utils";

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
    label: "Input port",
    key: "conn__to_A_end",
    type: "port_number",
  },
  {
    label: "Output port",
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
    <TableContainer component={Paper} sx={{ paddingBottom: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            {tableConfig.map((conf) => {
              return <TableCell key={conf.label}>{conf.label}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {portDetails.map((port) => {
            return (
              <TableRow key={port.id}>
                {tableConfig.map((conf) => {
                  const value = get(port, conf.key, "");
                  if (conf.type === "color") {
                    return (
                      <TableCell
                        key={conf.key}
                        sx={{
                          backgroundColor: FIBER_COLOR_CODE_HEX_MAPPING[value],
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  }
                  //
                  else if (conf.type === "port_number") {
                    return <PortCell key={conf.key} value={value} />;
                  }
                  //
                  else {
                    return <TableCell key={conf.key}>{value}</TableCell>;
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CablePortDetails;
