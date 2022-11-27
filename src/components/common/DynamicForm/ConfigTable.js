import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { get, size } from "lodash";
import { Typography } from "@mui/material";

const ConfigTable = ({ data, section }) => {
  const tableFields = get(section, "table_fields", []);

  if (size(data)) {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {tableFields.map((row) => (
                <TableCell key={row.headerName}>{row.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {tableFields.map((field) => (
                    <TableCell key={field.headerName}>
                      {get(row, field.headerName, "")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return (
      <Paper p={2}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No configurations
        </Typography>
      </Paper>
    );
  }
};

export default ConfigTable;
