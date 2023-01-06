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

const PortList = ({ portList, tableConfig }) => {
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
          {portList.map((port) => {
            return (
              <TableRow
                key={port.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {tableConfig.map((conf) => {
                  const value = get(port, conf.key, "");
                  if (conf.type === "port_number") {
                    return <PortCell key={conf.key} value={value} />;
                  }
                  //
                  else if (conf.type === "color") {
                    const isDash = value.includes("d-");
                    const currFibColor = isDash ? value.substring(2) : value;
                    return (
                      <TableCell
                        key={conf.key}
                        sx={{
                          backgroundColor:
                            FIBER_COLOR_CODE_HEX_MAPPING[currFibColor],
                        }}
                      >
                        {value}
                      </TableCell>
                    );
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

export default PortList;
