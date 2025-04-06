import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Import colors from shared file
const COLORS = {
    // Primary brand color
    PRIMARY: '#203120',

    // Secondary color for accents
    SECONDARY: '#558855',

    // Background colors
    LIGHT_BG: '#f8f9f6',
    DARK_BG: '#0f170f',

    // Paper colors (cards, dialogs, etc)
    LIGHT_PAPER: '#ffffff',
    DARK_PAPER: '#192619',

    // Text colors
    LIGHT_TEXT: '#263126',
    DARK_TEXT: '#e0e8e0',

    // Status colors
    SUCCESS: '#4caf50', // Green
    SUCCESS_DARK: '#357a38', // Darker green for dark mode
    ERROR: '#f44336', // Red
    WARNING: '#ff9800', // Amber/orange for warning

    // Action colors
    ACTION_HOVER_LIGHT: 'rgba(0, 0, 0, 0.04)',
    ACTION_HOVER_DARK: 'rgba(255, 255, 255, 0.1)',
    ACTION_BG_DARK: 'rgba(255, 255, 255, 0.12)',
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Load theme from localStorage or default to 'light'
    const [mode, setMode] = useState<ThemeMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as ThemeMode) || 'light';
    });

    // Update localStorage when theme changes
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Toggle between light and dark
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // Create MUI theme based on current mode
    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: COLORS.PRIMARY,
                contrastText: '#ffffff',
            },
            secondary: {
                main: COLORS.SECONDARY,
            },
            success: {
                main: mode === 'light' ? COLORS.SUCCESS : COLORS.SUCCESS_DARK,
                contrastText: '#ffffff',
            },
            error: {
                main: COLORS.ERROR,
            },
            warning: {
                main: COLORS.WARNING,
            },
            background: {
                default: mode === 'light' ? COLORS.LIGHT_BG : COLORS.DARK_BG,
                paper: mode === 'light' ? COLORS.LIGHT_PAPER : COLORS.DARK_PAPER,
            },
            text: {
                primary: mode === 'light' ? COLORS.LIGHT_TEXT : COLORS.DARK_TEXT,
            },
            action: {
                hover: mode === 'light' ? COLORS.ACTION_HOVER_LIGHT : COLORS.ACTION_HOVER_DARK,
            },
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: mode === 'light' ? COLORS.PRIMARY : '#1a261a',
                        color: '#fff',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: COLORS.PRIMARY,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'dark' && {
                            '&.MuiChip-colorSuccess': {
                                color: '#ffffff',
                            },
                            '&.MuiChip-colorError': {
                                color: '#ffffff',
                            },
                            '&.MuiChip-colorWarning': {
                                color: '#ffffff',
                            },
                        }),
                    }),
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'dark' && {
                            '&.MuiIconButton-colorSuccess': {
                                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.25)',
                                },
                            },
                            '&.MuiIconButton-colorWarning': {
                                backgroundColor: 'rgba(255, 152, 0, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 152, 0, 0.25)',
                                },
                            },
                            '&.MuiIconButton-colorError': {
                                backgroundColor: 'rgba(244, 67, 54, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.25)',
                                },
                            },
                        }),
                    }),
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'dark' && {
                            '&.MuiButton-outlined': {
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : undefined,
                            },
                        }),
                    }),
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}; 