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
  helperText,
  error,
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
            error={error}
            InputLabelProps={{ shrink }}
            className="form-select-controller"
            InputProps={{
              className: "form-select-input-wrapper",
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
                    {...rest}
                  />
                );
              },
            }}
            helperText={helperText}
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
  helperText,
  error,
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
            error={error}
            InputLabelProps={{ shrink }}
            className="form-creatable-select-controller"
            InputProps={{
              className: "form-creatable-select-input-wrapper",
              notched: shrink,
              inputComponent: (inputProps) => {
                const { className } = inputProps;
                return (
                  <CreatableSelect
                    value={field.value}
                    onChange={field.onChange}
                    isDisabled={get(rest, "disabled", false)}
                    className={`${className} form-creatable-select`}
                    classNamePrefix="form-creatable-select"
                    placeholder=" "
                    openMenuOnClick
                    menuIsOpen={menuOpen}
                    onMenuOpen={() => setMenuOpen(true)}
                    onMenuClose={() => setMenuOpen(false)}
                    {...rest}
                  />
                );
              },
            }}
            helperText={helperText}
          />
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
