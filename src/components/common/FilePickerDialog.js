import React, { useCallback, useState } from "react";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LoadingButton from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";

/**
 * Parent:
 *    WorkOrderPage
 * Render:
 *    file select dialog
 *    button in center if no any file selected
 *    selected file list, add more button, upload, close button if file selected
 *    additional remove selected file option
 */
const FilePickerDialog = (props) => {
  const { onSubmit, onClose, loading, accept, heading = "" } = props;
  const [files, setFiles] = useState([]);

  const handleFileUpload = useCallback((event) => {
    setFiles((files) => [...files, ...event.target.files]);
  }, []);

  const handleFileRemove = useCallback(
    (index) => () => {
      let newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    },
    [files, setFiles]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(files);
  }, [files]);

  if (files.length) {
    return (
      <>
        <DialogTitle
          id="scroll-dialog-title"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <UploadButton
            text="Add More"
            onChange={handleFileUpload}
            accept={accept}
          />
          <Typography variant="h6" color="primary.dark">
            {heading}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            padding: 0,
            height: "502px",
          }}
        >
          <TableContainer sx={{ maxHeight: "500px" }}>
            <Table stickyHeader size="small" aria-label="sticky dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell width={40}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={file.name}
                    >
                      <TableCell>{file.name}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="close"
                          onClick={handleFileRemove(index)}
                          size="small"
                        >
                          <CloseIcon size="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            variant="outlined"
            loading={loading}
          >
            Upload
          </LoadingButton>
        </DialogActions>
      </>
    );
  } else {
    return (
      <>
        <DialogTitle
          id="scroll-dialog-title"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div />
          <Typography variant="h6" color="primary.dark">
            {heading}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            height: "500px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <UploadButton
            text="Select Files"
            onChange={handleFileUpload}
            accept={accept}
          />
        </DialogContent>
      </>
    );
  }
};

const UploadInput = styled("input")({
  display: "none",
});

/**
 * Parent
 *    FilePickerDialog
 *
 * separate file picker button
 */
const UploadButton = ({ text, onChange, accept = "*" }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor="contained-button-file">
        <UploadInput
          id="contained-button-file"
          type="file"
          onChange={onChange}
          accept={accept}
        />
        <Button variant="text" component="span">
          {text}
        </Button>
      </label>
    </Stack>
  );
};

export default FilePickerDialog;
