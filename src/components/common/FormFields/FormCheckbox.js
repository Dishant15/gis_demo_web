import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";

export const FormCheckbox = ({ label, name, control, rules, color }) => {
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
                color={color}
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
