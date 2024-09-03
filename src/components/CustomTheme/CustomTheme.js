import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors'; // Import MUI's green palette

// Create a theme instance with a custom primary color
const theme = createTheme({
  palette: {
    primary: {
      // TODO: ADD GP2 GREEN
      main: green[500],
    },
  },
});

export default theme;
