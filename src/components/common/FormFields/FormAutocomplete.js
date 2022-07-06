import React from "react";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export const FormAutocomplete = (props) => {
  const {
    name,
    control,
    rules,
    label,
    required,
    options,
    labelKey = "label",
    valueKey = "value",
    isMulti,
    error,
    helperText,
    ...rest
  } = props;
  const theme = useTheme();

  return (
    <Controller
      render={({ field }) => {
        return (
          <FormControl error={error}>
            <Autocomplete
              multiple
              options={options}
              freeSolo
              renderTags={(value, getTagProps) => {
                return value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="freeSolo"
                  placeholder="Favorites"
                />
              )}
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
