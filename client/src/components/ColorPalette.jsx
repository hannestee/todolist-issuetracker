import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#c93636',
      main: '#c93636',
      dark: '#c93636',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e475e8',
      main: '#e475e8',
      dark: '#e475e8',
      contrastText: '#000',
    },
    highImportanceColor: {
      light: '#c93636',
      main: '#c93636',
      dark: '#c93636',
      contrastText: '#fff',
    },
    mediumImportanceColor: {
        light: '#a3a3a3',
        main: '#a3a3a3',
        dark: '#a3a3a3',
        contrastText: '#fff',
    },
    lowImportanceColor: {
        light: '#baffc9',
        main: '#baffc9',
        dark: '#baffc9',
        contrastText: '#fff',
    }
  },
});

export default theme;