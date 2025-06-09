import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000000", // Primary color
    },
    secondary: {
      main: "#D9A04C", // Secondary color
    },
    background: {
      default: "#424242", // Dark grey background
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000", // Black AppBar
        },
      },
    },
  },
});

export default theme;
