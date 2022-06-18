import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1881bc",
    },
    secondary: {
      main: "#b98919",
    },
    background: {
      default: "#efefef",
    },
    error: {
      main: "#e24c4b",
      contrastText: "#fff",
    },
    warning: {
      main: "#ffc005",
      contrastText: "#fff",
    },
    success: {
      main: "#4bae4f",
      contrastText: "#fff",
    },
  },
});
