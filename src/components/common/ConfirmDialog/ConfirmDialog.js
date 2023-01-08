import React from "react";

import noop from "lodash/noop";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

const ConfirmDialog = ({
  show = false,
  isLoading = false,
  title = "Delete Configuration",
  text = "Are you sure to delete ?",
  confirmText = "Delete",
  deleteText = "Cancel",
  onClose = noop,
  onConfirm = noop,
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
              onClick={onConfirm}
              autoFocus
              loading={isLoading}
              color="error"
            >
              {confirmText}
            </LoadingButton>
            <Button onClick={onClose}>{deleteText}</Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default ConfirmDialog;
