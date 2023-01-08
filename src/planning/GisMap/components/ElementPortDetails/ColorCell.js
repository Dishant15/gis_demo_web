import React from "react";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import { FIBER_COLOR_CODE_HEX_MAPPING } from "./port.utils";

const ColorCell = ({ value, align }) => {
  const isDash = value.includes("d-");
  const currFibColor = isDash ? value.substring(2) : value;
  return (
    <TableCell
      sx={{
        backgroundColor: FIBER_COLOR_CODE_HEX_MAPPING[currFibColor],
        position: "relative",
      }}
      align={align}
    >
      {value}
      {isDash ? (
        <Box
          sx={{
            borderBottomWidth: 2,
            borderBottomStyle: "dashed",
            position: "absolute",
            left: 0,
            right: 0,
          }}
        />
      ) : null}
    </TableCell>
  );
};

export default ColorCell;
