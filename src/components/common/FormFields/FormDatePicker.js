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
                required={required}
                error={!!errors.username}
                label={label}
                helperText={errors.username?.message}
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
