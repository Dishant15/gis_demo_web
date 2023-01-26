import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { elementBorders, elementLabelCenter } from "./style.constants";

const JcSplicingBlock = ({ portData }) => {
  const { name, unique_id } = portData;

  return (
    <Box>
      <Typography textAlign="center" variant="h6">
        {name}
      </Typography>
      <Stack direction="row" sx={{ height: "300px" }}>
        <Stack
          direction="row"
          sx={{
            flex: 1,
            background: "yellow",
            position: "relative",
            width: "150px",
            border: elementBorders,
            borderRadius: "8px",
          }}
        >
          <Box sx={elementLabelCenter}>{unique_id}</Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default JcSplicingBlock;
