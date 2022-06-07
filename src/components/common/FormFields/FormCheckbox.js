import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";

export const FormCheckbox = ({ label, name, control, rules }) => {
  return (
    <Controller
      render={({ field }) => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                ref={field.ref}
                checked={!!field.value}
                onChange={field.onChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={label}
          />
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
