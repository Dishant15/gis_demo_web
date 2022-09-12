import React from "react";

import { Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="edit" color="secondary" onClick={handleEdit}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" color="error" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};
