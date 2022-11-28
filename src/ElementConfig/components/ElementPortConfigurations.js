import React from "react";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

import CloseIcon from "@mui/icons-material/Close";

const ElementPortConfigurations = ({ data, onClose }) => {
  console.log(
    "🚀 ~ file: ElementPortConfigurations.js ~ line 12 ~ ElementPortConfigurations ~ data",
    data
  );
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        <div />
        <Typography variant="h6" color="primary.dark">
          Element Port Configurations
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        dividers
        sx={{
          padding: 0,
          height: "502px",
        }}
      >
        <Typography variant="h6">write code here.</Typography>
      </DialogContent>
    </>
  );
};

export default ElementPortConfigurations;
