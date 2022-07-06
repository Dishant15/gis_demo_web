import React from "react";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (currentValue, selectedValue, theme) => {
  return {
    fontWeight:
      selectedValue && selectedValue.indexOf(currentValue) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

export const FormMUISelect = (props) => {
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
            <InputLabel id={name}>{label}</InputLabel>
            <Select
              ref={field.ref}
              labelId={name}
              id={name + "select"}
              multiple={isMulti}
              value={field.value}
              onChange={field.onChange}
              input={<OutlinedInput label={label} />}
              MenuProps={MenuProps}
            >
              {options.map((opt) => (
                <MenuItem
                  key={opt[valueKey]}
                  value={opt[valueKey]}
                  style={getStyles(opt[labelKey], field.value, theme)}
                >
                  {opt[labelKey]}
                </MenuItem>
              ))}
            </Select>
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
