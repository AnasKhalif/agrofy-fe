import { Theme, Components } from '@mui/material/styles';
import '@mui/x-date-pickers/themeAugmentation';

/**
 * MUI Component Style Overrides
 * Matches styling from custom-theme.tsx (theme-ui components)
 */
export const getMuiComponentOverrides = (theme: Theme): Components => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease-in-out',
        '&:focus': {
          outline: 'none',
          zIndex: 10,
        },
      },
      sizeSmall: {
        padding: '6px 12px',
        fontSize: '0.875rem',
      },
      sizeMedium: {
        padding: '8px 16px',
        fontSize: '0.875rem',
      },
      sizeLarge: {
        padding: '10px 20px',
        fontSize: '1rem',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      containedSecondary: {
        backgroundColor: theme.palette.secondary.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      },
      containedError: {
        backgroundColor: theme.palette.error.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.error.dark,
        },
      },
      containedWarning: {
        backgroundColor: theme.palette.warning.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.warning.dark,
        },
      },
      containedInfo: {
        backgroundColor: theme.palette.info.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.info.dark,
        },
      },
      containedSuccess: {
        backgroundColor: theme.palette.success.main,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: theme.palette.success.dark,
        },
      },
      outlined: {
        borderWidth: '1px',
        '&:hover': {
          borderWidth: '1px',
        },
      },
      outlinedPrimary: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          borderColor: theme.palette.primary.main,
        },
      },
      text: {
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: theme.shape.borderRadius,
          fontSize: '0.875rem',
          backgroundColor: 'transparent',
          '& fieldset': {
            borderColor: theme.palette.divider,
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.divider,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
          '&.Mui-error fieldset': {
            borderColor: theme.palette.error.main,
          },
        },
        '& .MuiInputBase-input:not(textarea)': {
          padding: '10px 14px',
          fontSize: '0.875rem',
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.5,
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          fontWeight: 600,
          color: theme.palette.mode === 'light' 
            ? theme.palette.grey[700]
            : '#ffffff',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.75rem',
          marginLeft: 0,
          marginTop: '4px',
        },
      },
    },
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1px',
        },
        '&.Mui-focused': {
          boxShadow: 'none',
        },
      },
      notchedOutline: {
        borderColor: theme.palette.divider,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '16px',
        boxShadow: theme.palette.mode === 'light'
          ? '0px 2px 4px -1px rgba(175, 182, 201, 0.2)'
          : 'none',
        backgroundColor: theme.palette.mode === 'light'
          ? '#ffffff'
          : theme.palette.grey[800],
        position: 'relative',
        width: '100%',
        wordWrap: 'break-word',
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': {
          paddingBottom: 0,
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
        marginBottom: '16px',
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        padding: '4px',
        '&.Mui-checked': {
          color: theme.palette.primary.main,
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1.25rem',
          borderRadius: '2px',
        },
      },
    },
    defaultProps: {
      color: 'primary',
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        fontSize: '0.875rem',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1px',
        },
      },
      select: {
        padding: '10px 14px',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
          },
        },
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          fontWeight: 600,
          color: theme.palette.mode === 'light' 
            ? theme.palette.grey[700]
            : '#ffffff',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: theme.palette.mode === 'light' 
          ? theme.palette.grey[700]
          : '#ffffff',
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: '0.75rem',
        marginLeft: 0,
        marginTop: '4px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
      },
      elevation1: {
        boxShadow: theme.palette.mode === 'light'
          ? '0px 2px 4px -1px rgba(175, 182, 201, 0.2)'
          : 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: theme.shape.borderRadius,
        padding: '24px',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        fontWeight: 600,
        padding: '0 0 16px 0',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '16px 0',
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 0 0 0',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
      },
      colorError: {
        '&:hover': {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
      },
      colorWarning: {
        '&:hover': {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        },
      },
      colorSecondary: {
        '&:hover': {
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.main,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '4px',
        fontWeight: 600,
        fontSize: '0.75rem',
      },
      colorPrimary: {
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
      },
      colorSecondary: {
        backgroundColor: theme.palette.secondary.main,
        color: '#ffffff',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'capitalize',
          color: theme.palette.mode === 'light' 
            ? theme.palette.grey[700]
            : '#ffffff',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'transparent',
          padding: '16px',
        },
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          padding: '16px',
          backgroundColor: 'transparent',
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : 'transparent',
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 44,
        height: 24,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.primary.main,
              opacity: 1,
              border: 0,
            },
          },
        },
        '& .MuiSwitch-thumb': {
          width: 20,
          height: 20,
        },
        '& .MuiSwitch-track': {
          borderRadius: 12,
          backgroundColor: theme.palette.grey[300],
          opacity: 1,
        },
      },
    },
  },
  MuiPickersTextField: {
    styleOverrides: {
      root: {
        '& .MuiPickersOutlinedInput-root': {
          borderRadius: theme.shape.borderRadius,
          fontSize: '0.875rem',
          backgroundColor: 'transparent',
          '& fieldset': {
            borderColor: theme.palette.divider,
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.divider,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
          '&.Mui-error fieldset': {
            borderColor: theme.palette.error.main,
          },
        },
      },
    },
  },
  MuiPickersInputBase: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        fontSize: '0.875rem',
        backgroundColor: 'transparent',
        '& .MuiPickersInputBase-input': {
          padding: '10px 14px',
          fontSize: '0.875rem',
        },
        '& .MuiPickersInputBase-sectionsContainer': {
          padding: '10px 0',
        },
      },
    },
  },
  MuiPickersOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        '&:hover .MuiPickersOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1px',
        },
      },
      notchedOutline: {
        borderColor: theme.palette.divider,
        borderWidth: '1px',
      },
    },
  },
  MuiPickersSectionList: {
    styleOverrides: {
      root: {
        padding: '10px 14px',
        '& .MuiPickersSectionList-section': {
          fontSize: '0.875rem',
        },
        '& .MuiPickersSectionList-sectionContent': {
          fontSize: '0.875rem',
          color: theme.palette.text.secondary,
        },
      },
    },
  },
  MuiDateCalendar: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        borderRadius: theme.shape.borderRadius,
        boxShadow: 'none',
        '& .MuiPickersCalendarHeader-root': {
          paddingLeft: '14px',
          paddingRight: '14px',
        },
        '& .MuiDayCalendar-header': {
          '& .MuiTypography-root': {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: theme.palette.mode === 'light'
              ? theme.palette.grey[700]
              : '#ffffff',
          },
        },
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
          opacity: 0.5,
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiChip-root': {
          margin: '0 3px',
          height: '28.13px'
        },
      },
      inputRoot: {
        fontSize: '0.875rem',
      },
      input: {
        height: '23.13px'
      }
    },
  },
});
