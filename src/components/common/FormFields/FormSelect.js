import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  outlinedInputClasses,
  Box,
} from "@mui/material";

import get from "lodash/get";
import find from "lodash/find";
import map from "lodash/map";
import split from "lodash/split";

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
  options,
  isMulti,
  labelKey = "label",
  valueKey = "value",
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        const selectValue = isMulti
          ? !!field.value
            ? map(split(field.value, ","), (d) =>
                find(options, (val) => val[valueKey] == d)
              )
            : []
          : find(options, (val) => val[valueKey] == field.value);

        return (
          <Select
            {...rest}
            isMulti={isMulti}
            options={options}
            value={selectValue}
            onChange={(newValue) => {
              const newValueOp = isMulti
                ? map(newValue, valueKey).join(",")
                : get(newValue, valueKey, "");
              field.onChange(newValueOp);
            }}
            className={`${className} form-select`}
            classNamePrefix="form-select"
            placeholder=" "
            components={{ Control }}
            getOptionLabel={(o) => o[labelKey]}
            getOptionValue={(o) => o[valueKey]}
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
  options,
  labelKey = "label",
  valueKey = "value",
  ...rest
}) => {
  return (
    <Controller
      render={({ field }) => {
        // convert "valueKey1,valueKey1" to [ { [labelKey], [valueKey] } ,...]
        const valueItems = !!field.value ? split(field.value, ",") : [];
        // get option from options otherwise create new
        const creatableValues = map(
          valueItems,
          (d) =>
            find(options, (val) => val[valueKey] == d) || {
              [labelKey]: d,
              [valueKey]: d,
            }
        );

        return (
          <CreatableSelect
            {...rest}
            options={options}
            value={creatableValues}
            onChange={(newValue) => {
              // convert [ { [labelKey], [valueKey] } ,...] to "valueKey1,valueKey1"
              const newValueOp = map(newValue, valueKey).join(",");
              field.onChange(newValueOp);
            }}
            className={`${className} form-select`}
            classNamePrefix="form-select"
            placeholder=" "
            components={{ Control }}
            getOptionLabel={(o) => o[labelKey]}
            getOptionValue={(o) => o[valueKey]}
            getNewOptionData={(inputValue, optionLabel) => {
              // return new created object
              return {
                [labelKey]: optionLabel,
                [valueKey]: inputValue,
                __isNew__: true,
              };
            }}
          />
        );
      }}
      name={name}
      control={control}
      rules={rules}
    />
  );
};
