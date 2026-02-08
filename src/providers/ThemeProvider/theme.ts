import { Roboto } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap'
});

const customBlack = 'rgba(0,0,0,0.8)';

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily
  },
  palette: {
    secondary: {
      main: '#E60000'
    },
    background: {
      default: '#F5F5F5'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          zIndex: 1201
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        regular: {
          '@media (min-width: 600px)': {
            paddingLeft: 12,
            paddingRight: 20
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          overflow: 'hidden'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          border: '1px solid #ced4da',
          'Mui-error': {
            border: '1px solid red'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          display: 'none'
        },
        input: {
          padding: '10px 10px'
        },
        root: {
          padding: '0 !important'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: customBlack,
          position: 'static'
        },
        formControl: {
          transform: 'none',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px',
          background: 'transparent',
          transition: 'none'
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px',
          background: 'transparent',
          transition: 'none'
        },
        label: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: (props) => ({
          '&.Mui-checked': { color: props.theme.palette.secondary.main },
          '&.MuiCheckbox-indeterminate': { color: props.theme.palette.secondary.main },
          padding: '8px'
        })
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          marginRight: 0,
          color: customBlack
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: grey.A200
          },
          '&.Mui-selected:hover': {
            backgroundColor: grey.A100
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { backgroundColor: 'transparent' },
        head: { backgroundColor: 'white' }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          ':last-child': {
            paddingBottom: '16px'
          }
        }
      }
    }
  }
});

export default theme;
