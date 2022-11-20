import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import get from "lodash/get";

import { DateTimePickerInput } from "react-datetime-range-super-picker";

export const FormDateTimePicker = ({
  label,
  name,
  control,
  rules,
  error,
  helperText,
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        return (
          <DateTimePickerInput
            date={field.value ? new Date(field.value) : undefined}
            onDateTimeUpdate={({ date }) => field.onChange(date.date)}
            inputComponent={
              <TextField
                className="full-width"
                InputLabelProps={{
                  required: !!get(rules, "required"),
                }}
                error={error}
                label={label}
                helperText={helperText}
              />
            }
            {...rest}
          />
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
