import React from "react";
import { Controller } from "react-hook-form";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

import { UploadButton } from "../FilePickerDialog";

import get from "lodash/get";

export const FormFileField = ({
  label,
  name,
  control,
  rules,
  errors,
  required,
  helperText,
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        const currFileName = get(field.value, "name", "");
        return (
          <>
            <Typography
              pl={1}
              pb={0.5}
              variant="caption"
              color="GrayText"
              component="div"
            >
              {label}
            </Typography>
            <UploadButton
              text="Select File"
              variant="contained"
              // accept=".xlsx, .xls, .csv"
              onChange={(e) => {
                const file = e.target.files[0];
                field.onChange(file);
              }}
            />
            {currFileName ? (
              <Box display="flex" alignItems="center">
                <Typography variant="body2" pl={1} pt={0.5}>
                  {currFileName}
                </Typography>
                <CloseIcon
                  className="clickable"
                  onClick={() => field.onChange(null)}
                />
              </Box>
            ) : null}
          </>
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
