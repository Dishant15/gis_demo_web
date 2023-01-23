import React from "react";

import get from "lodash/get";
import size from "lodash/size";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import PortCell from "./PortCell";
import ColorCell from "./ColorCell";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };
});

const StyledTableCell = styled(TableCell)(({ theme }) => {
  return {
    color: theme.palette.primary.contrastText,
    textAlign: "center",
  };
});

const PortList = ({ portList, tableConfig }) => {
  if (!size(portList)) {
    return (
      <Box pb={1}>
        <Typography variant="h6" color="text.secondary">
          No port details available
        </Typography>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} sx={{ paddingBottom: 1 }}>
      <Table>
        <StyledTableHead>
          <TableRow>
            {tableConfig.map((conf) => {
              return (
                <StyledTableCell key={conf.label}>{conf.label}</StyledTableCell>
              );
            })}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {portList.map((port) => {
            return (
              <StyledTableRow
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
                    return <ColorCell key={conf.key} value={value} />;
                  }
                  //
                  else {
                    return <TableCell key={conf.key}>{value}</TableCell>;
                  }
                })}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PortList;
