import React from "react";

import { Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";

/**
 * Render Action btn col
 */
export const ActionCell = (props) => {
  const handleEdit = () => {
    props.onEditClick(props.data);
  };
  const handleDelete = () => {
    props.onDeleteClick(props.data);
  };
  const handleView = () => {
    props.onViewClick(props.data);
  };
  return (
    <Stack direction="row" spacing={1}>
      {props.onViewClick ? (
        <IconButton aria-label="details" onClick={handleView}>
          <SettingsInputCompositeIcon />
        </IconButton>
      ) : null}
      {props.onEditClick ? (
        <IconButton aria-label="edit" color="secondary" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
      ) : null}
      {props.onDeleteClick ? (
        <IconButton aria-label="delete" color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      ) : null}
    </Stack>
  );
};
