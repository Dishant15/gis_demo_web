import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import { DatePickerInput } from "react-datetime-range-super-picker";

export const FormDatePicker = ({
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
        return (
          <DatePickerInput
            date={field.value}
            onDateUpdate={({ date }) => field.onChange(date)}
            inputComponent={
              <TextField
                InputLabelProps={{
                  required: required,
                }}
                error={errors}
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
