// Theme color constants
export const COLORS = {
    // Primary brand color
    PRIMARY: '#203120',
    PRIMARY_DARK: '#1a261a',
    PRIMARY_LIGHT: '#2d462d',

    // Secondary color for accents
    SECONDARY: '#558855',
    SECONDARY_DARK: '#3d633d',
    SECONDARY_LIGHT: '#6d9f6d',

    // Background colors
    LIGHT: {
        BACKGROUND: '#f8f9f6',
        PAPER: '#ffffff',
        TEXT: '#263126',
    },
    DARK: {
        BACKGROUND: '#0f170f',
        PAPER: '#192619',
        TEXT: '#e0e8e0',
    },

    // Status colors
    STATUS: {
        SUCCESS: '#4caf50',
        SUCCESS_DARK: '#357a38',
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
            HOVER: 'rgba(0, 0, 0, 0.04)',
            SELECTED: 'rgba(0, 0, 0, 0.08)',
            DISABLED: 'rgba(0, 0, 0, 0.26)',
            DISABLED_BACKGROUND: 'rgba(0, 0, 0, 0.12)',
        },
        DARK: {
            HOVER: 'rgba(255, 255, 255, 0.1)',
            SELECTED: 'rgba(255, 255, 255, 0.16)',
            DISABLED: 'rgba(255, 255, 255, 0.3)',
            DISABLED_BACKGROUND: 'rgba(255, 255, 255, 0.12)',
        }
    }
};

// Theme-specific component overrides
export const COMPONENT_OVERRIDES = {
    MuiDrawer: {
        paper: (mode: 'light' | 'dark') => ({
            backgroundColor: mode === 'light' ? COLORS.PRIMARY : COLORS.PRIMARY_DARK,
            color: '#ffffff',
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
        dark: {
            outlined: {
                borderColor: 'rgba(255, 255, 255, 0.23)',
            },
        },
    },
}; 