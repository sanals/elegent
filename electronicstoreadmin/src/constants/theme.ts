import { Theme } from '@mui/material/styles';

// Theme color constants
export const COLORS = {
  // Primary brand color
  PRIMARY: '#09272f',
  PRIMARY_DARK: '#051318',
  PRIMARY_LIGHT: '#0d3440',

  // Secondary color for accents
  SECONDARY: '#1ca879',
  SECONDARY_DARK: '#138e64',
  SECONDARY_LIGHT: '#26c68e',

  // Background colors
  LIGHT: {
    BACKGROUND: '#f8f9f6',
    PAPER: '#ffffff',
    TEXT: '#09272f',
  },
  DARK: {
    BACKGROUND: '#051318',
    PAPER: '#0a2b33',
    TEXT: '#e6f4ef',
  },

  // Status colors
  STATUS: {
    SUCCESS: '#0e7c58',
    SUCCESS_DARK: '#ebe972',
    ERROR: '#f44336',
    ERROR_DARK: '#d32f2f',
    WARNING: '#ff9800',
    WARNING_DARK: '#f57c00',
    INFO: '#2196f3',
    INFO_DARK: '#1976d2',
  },

  // Action colors
  ACTION: {
    LIGHT: {
      HOVER: 'rgba(9, 39, 47, 0.04)',
      SELECTED: 'rgba(9, 39, 47, 0.08)',
      DISABLED: 'rgba(0, 0, 0, 0.26)',
      DISABLED_BACKGROUND: 'rgba(0, 0, 0, 0.12)',
    },
    DARK: {
      HOVER: 'rgba(28, 168, 121, 0.1)',
      SELECTED: 'rgba(28, 168, 121, 0.16)',
      DISABLED: 'rgba(255, 255, 255, 0.3)',
      DISABLED_BACKGROUND: 'rgba(28, 168, 121, 0.12)',
    },
  },
};

// Theme-specific component overrides
export const COMPONENT_OVERRIDES = {
  MuiDrawer: {
    paper: (mode: 'light' | 'dark') => ({
      backgroundColor: mode === 'light' ? COLORS.PRIMARY : COLORS.PRIMARY_DARK,
      color: '#ffffff',
      '& .MuiListItemIcon-root': {
        color: 'rgba(255, 255, 255, 0.8)',
      },
      '& .MuiListItemButton-root': {
        '&:hover': {
          backgroundColor:
            mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
          },
        },
        '&.Mui-selected': {
          backgroundColor:
            mode === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor:
              mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)',
          },
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
          },
        },
      },
    }),
  },
  MuiAppBar: {
    root: {
      backgroundColor: COLORS.PRIMARY,
    },
  },
  MuiChip: {
    dark: {
      colorSuccess: { color: '#ffffff' },
      colorError: { color: '#ffffff' },
      colorWarning: { color: '#ffffff' },
      colorInfo: { color: '#ffffff' },
    },
  },
  MuiIconButton: {
    dark: {
      colorSuccess: {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.25)',
        },
      },
      colorWarning: {
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
        '&:hover': {
          backgroundColor: 'rgba(255, 152, 0, 0.25)',
        },
      },
      colorError: {
        backgroundColor: 'rgba(244, 67, 54, 0.15)',
        '&:hover': {
          backgroundColor: 'rgba(244, 67, 54, 0.25)',
        },
      },
      colorInfo: {
        backgroundColor: 'rgba(33, 150, 243, 0.15)',
        '&:hover': {
          backgroundColor: 'rgba(33, 150, 243, 0.25)',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      // Global styles for all buttons
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          // Outlined button styles
          '&.MuiButton-outlined': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
            '&:active': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.7)',
            },
          },
          // Contained button styles - improve contrast in dark mode
          '&.MuiButton-contained': {
            '&.MuiButton-containedPrimary': {
              backgroundColor: COLORS.PRIMARY_LIGHT, // Lighter green in dark mode
              '&:hover': {
                backgroundColor: COLORS.SECONDARY, // Even lighter on hover
              },
            },
            '&.MuiButton-containedSecondary': {
              backgroundColor: COLORS.SECONDARY_LIGHT,
              '&:hover': {
                backgroundColor: COLORS.SECONDARY,
              },
            },
          },
        }),
      }),
    },
    // Keep the old dark styles for backward compatibility
    dark: {
      outlined: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.23)',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&:active': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  },

  // Form Input Components
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.SECONDARY_LIGHT,
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.STATUS.ERROR,
          },
        }),
      }),
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-focused': {
            color: COLORS.SECONDARY_LIGHT,
          },
          '&.Mui-error': {
            color: COLORS.STATUS.ERROR,
          },
        }),
      }),
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
          },
          '& .MuiFormHelperText-root': {
            color: 'rgba(255, 255, 255, 0.6)',
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: COLORS.STATUS.ERROR_DARK,
          },
        }),
      }),
    },
  },

  MuiSelect: {
    styleOverrides: {
      icon: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          color: 'rgba(255, 255, 255, 0.7)',
        }),
      }),
    },
  },

  MuiFormControl: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          '& .MuiFormLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: COLORS.SECONDARY_LIGHT,
          },
        }),
      }),
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }),
      }),
    },
  },

  // Card and Paper components
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 8px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        border:
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.08)',
        // For dark mode, make cards slightly lighter than background
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
        }),
        // For light mode, add soft border
        ...(theme.palette.mode === 'light' && {
          backgroundColor: '#ffffff',
        }),
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 6px 12px rgba(0, 0, 0, 0.5)'
              : '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }),
    },
  },

  // Paper for other containers
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundImage: 'none',
        }),
      }),
    },
  },
};
