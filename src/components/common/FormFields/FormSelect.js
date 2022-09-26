import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  outlinedInputClasses,
  Box,
} from "@mui/material";

import { get } from "lodash";

import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";

// Good: Custom component declared outside of the Select scope
const Control = ({ children, ...props }) => {
  const menuIsOpen = props?.menuIsOpen;
  const hasValue = props?.hasValue;
  const shrink = hasValue || menuIsOpen;
  const { error, helperText, label, required, disabled } = get(
    props,
    "selectProps",
    {}
  );

  return (
    <FormControl
      fullWidth
      error={error}
      variant="outlined"
      required={!!required}
      disabled={disabled}
      color="primary"
    >
      <InputLabel
        variant="outlined"
        shrink={!!shrink}
        required={!!required}
        sx={{
          color: !!menuIsOpen && "primary.main",
        }}
      >
        {label}
      </InputLabel>
      <Box position="relative">
        <components.Control {...props}>{children}</components.Control>
        <fieldset
          className={`${outlinedInputClasses.notchedOutline} ${
            shrink ? "active" : ""
          } ${props?.menuIsOpen ? "highlight" : ""} ${
            error ? outlinedInputClasses.error : ""
          }`}
        >
          <legend className="legend">
            {required ? <span>{label} &nbsp;*</span> : <span>{label}</span>}
          </legend>
        </fieldset>
      </Box>
      {error ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export const FormSelect = ({
  className = "",
  name,
  control,
  rules,
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        return (
          <Select
            {...rest}
            value={field.value}
            onChange={field.onChange}
            className={`${className} form-select`}
            classNamePrefix="form-select"
            placeholder=" "
            components={{ Control }}
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
  className = "",
  name,
  control,
  rules,
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        return (
          <CreatableSelect
            {...rest}
            value={field.value}
            onChange={field.onChange}
            className={`${className} form-select`}
            classNamePrefix="form-select"
            placeholder=" "
            components={{ Control }}
          />
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
