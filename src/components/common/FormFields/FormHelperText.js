import React from "react";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

export const FormHelperTextControl = ({ error, children, className = "" }) => {
  return (
    <FormControl
      error={error}
      className={`custom-helpertext-control ${className}`}
    >
      <FormHelperText>{children}</FormHelperText>
    </FormControl>
  );
};
