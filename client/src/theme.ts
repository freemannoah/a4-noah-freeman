import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#1976d2',
    },

    secondary: {
      main: '#455a64',
    },

    success: {
      main: '#2e7d32',
    },

    error: {
      main: '#d32f2f',
    },

    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },

  typography: {
    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 600,
    },

    h3: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },
})
