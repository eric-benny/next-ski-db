import { createTheme } from "@mui/material/styles";

export const themeObj = {
  palette: {
    type: 'light',
    primary: {
      main: '#6c6c6e',
      light: '#B4B4B5'
    },
    secondary: {
      main: '#db252e',
      light: '#E25057'
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
      defaultRed: '#F7F4F4',
      paperRed: '#f7f1f1',
    }
  },
}

export const theme = createTheme(themeObj);
