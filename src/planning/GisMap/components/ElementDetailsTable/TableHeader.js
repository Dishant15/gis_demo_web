import React from "react";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import { DRAG_ICON_WIDTH } from "utils/constant";

/**
 * Parent:
 *    ElementDetailsTable
 */
const TableHeader = ({
  title,
  minimized,
  handlePopupMinimize,
  handleCloseDetails,
}) => {
  return (
    <Stack
      sx={{
        backgroundColor: "primary.main",
        color: "background.default",
      }}
      direction="row"
      alignItems="center"
      p={1}
      pl={`${DRAG_ICON_WIDTH}px`}
    >
      <Typography variant="h6" textAlign="left" flex={1}>
        {title}
      </Typography>
      <Tooltip title={minimized ? "Maximize" : "Minimize"}>
        <IconButton onClick={handlePopupMinimize}>
          {minimized ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Close">
        <IconButton onClick={handleCloseDetails}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default TableHeader;
