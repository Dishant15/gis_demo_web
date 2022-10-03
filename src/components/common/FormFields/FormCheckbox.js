import React from "react";
import {
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

export const FormCheckbox = ({
  label,
  name,
  control,
  rules,
  color,
  error,
  helperText,
}) => {
  return (
    <Controller
      render={({ field }) => {
        return (
          <FormControl error={error}>
            <FormControlLabel
              control={
                <Checkbox
                  ref={field.ref}
                  checked={!!field.value}
                  onChange={field.onChange}
                  inputProps={{ "aria-label": "controlled" }}
                  color={color}
                />
              }
              label={label}
            />
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
          </FormControl>
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
