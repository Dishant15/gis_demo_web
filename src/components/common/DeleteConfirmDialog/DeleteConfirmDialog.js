import React from "react";

import noop from "lodash/noop";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

const DeleteConfirmDialog = ({
  show = false,
  onClose = noop,
  title = "Delete Configuration",
  text = "Are you sure to delete ?",
  isLoading = false,
  onDeleteConfirm = noop,
}) => {
  return (
    <Dialog open={show} onClose={onClose}>
      {show ? (
        <>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              onClick={onDeleteConfirm}
              autoFocus
              loading={isLoading}
              color="error"
            >
              Delete
            </LoadingButton>
            <Button onClick={onClose}>Cancel</Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default DeleteConfirmDialog;
