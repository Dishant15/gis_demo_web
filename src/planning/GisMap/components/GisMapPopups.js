import React from "react";

import { Box, Paper, Portal } from "@mui/material";

import Draggable from "react-draggable";

import { ReactComponent as DragIcon } from "assets/drag.svg";

import { DRAG_ICON_WIDTH } from "utils/constant";
import "planning/styles/gis-map-popup.scss";
/**
 * Wrapper around any popup shown on PlanningPage over GisMap
 * handles positioning
 * children have to handle height / width cap
 *
 * Children
 *  ElementDetailsTable
 *  DynamicForm
 *  Paper popups on map add / edit events
 */
const GisMapPopups = ({ children, dragId }) => {
  return (
    <Portal>
      <Draggable
        handle={`#${dragId}`}
        disabled={!Boolean(dragId)}
        // bounds="body" // do not overflow out of body
      >
        <Box
          sx={{
            position: "fixed",
            top: "10%",
            right: "10%",
          }}
        >
          <Paper elevation={3} className="g-relative">
            {dragId ? (
              <DragIcon
                id={dragId}
                className="drag-icon"
                width={DRAG_ICON_WIDTH}
              />
            ) : null}
            {children}
          </Paper>
        </Box>
      </Draggable>
    </Portal>
  );
};

export default GisMapPopups;
