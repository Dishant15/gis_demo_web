import React from "react";
import { Controller } from "react-hook-form";
import { InputLabel } from "@mui/material";
import { get } from "lodash";

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
  return (
    <Controller
      render={({ field }) => {
        return (
          <>
            <InputLabel required>{label}</InputLabel>
            <Select
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
            <InputLabel required>{label}</InputLabel>
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
