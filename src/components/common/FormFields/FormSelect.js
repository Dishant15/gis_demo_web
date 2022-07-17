import React, { useState, forwardRef } from "react";
import { Controller } from "react-hook-form";
import { InputLabel, TextField } from "@mui/material";
import { get, size } from "lodash";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export const FormSelect = ({
  name,
  control,
  rules,
  label,
  required,
  ...rest
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Controller
      render={({ field }) => {
        const shrink = menuOpen || !!size(field.value);
        return (
          <TextField
            ref={field.ref}
            id={name}
            label={label}
            variant="outlined"
            multiline
            focused={menuOpen}
            required={required}
            InputLabelProps={{ shrink }}
            InputProps={{
              style: {
                padding: 0,
              },
              notched: shrink,
              inputComponent: (inputProps) => {
                const { className } = inputProps;
                return (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    isDisabled={get(rest, "disabled", false)}
                    className={`${className} form-select`}
                    classNamePrefix="form-select"
                    placeholder=" "
                    openMenuOnClick
                    menuIsOpen={menuOpen}
                    onMenuOpen={() => setMenuOpen(true)}
                    onMenuClose={() => setMenuOpen(false)}
                    styles={{
                      control: (style) => {
                        return Object.assign(style, {
                          padding: "9px",
                          borderColor: "transparent",
                        });
                      },
                    }}
                    {...rest}
                  />
                );
              },
            }}
            helperText="Please enter your name"
          />
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};

export const FormCreatableSelect = ({
  name,
  control,
  rules,
  label,
  required,
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        return (
          <>
            <InputLabel required={required}>{label}</InputLabel>
            <CreatableSelect
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              isDisabled={get(rest, "disabled", false)}
              {...rest}
            />
          </>
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
