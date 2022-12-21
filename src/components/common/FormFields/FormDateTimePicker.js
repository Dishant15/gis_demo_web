import React, { useCallback, useState } from "react";
import { Controller } from "react-hook-form";

import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { format } from "date-fns";

import { DateTimePicker } from "react-datetime-range-super-picker";

export const FormDateTimePicker = ({
  label,
  name,
  control,
  rules,
  error,
  required,
  helperText,
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.target);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <Controller
      render={({ field }) => {
        return (
          <>
            <Box onClick={handleClick}>
              <TextField
                className="full-width"
                InputLabelProps={{
                  required: required,
                  shrink: !!field.value,
                }}
                error={error}
                label={label}
                helperText={helperText}
                value={
                  field.value
                    ? format(field.value, "dd/MM/YYY hh:mm aaa")
                    : null
                }
              />
            </Box>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              disableAutoFocus
              disableEnforceFocus
            >
              <DateTimePicker
                date={field.value ? new Date(field.value) : undefined}
                onDateTimeUpdate={({ date }) => {
                  field.onChange(date.date);
                }}
              />
            </Popover>
          </>
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
