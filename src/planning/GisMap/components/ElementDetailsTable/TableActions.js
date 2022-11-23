import React from "react";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

/**
 * Parent:
 *    ElementDetailsTable
 */
const TableActions = ({ baseList = [] }) => {
  return (
    <Stack
      sx={{ boxShadow: "0px 5px 7px -3px rgba(122,122,122,0.51)" }}
      p={2}
      direction="row"
      spacing={2}
    >
      {baseList.map(({ name, Icon, onClick }) => {
        return (
          <Tooltip title={name} key={name}>
            <IconButton
              aria-label={name}
              color="secondary"
              sx={{
                border: "1px solid",
                borderRadius: 1,
              }}
              onClick={onClick}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default TableActions;
