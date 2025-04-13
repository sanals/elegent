import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { COLORS, COMPONENT_OVERRIDES } from '../constants/theme';

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
    const [mode, setMode] = useState<ThemeMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as ThemeMode) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: COLORS.PRIMARY,
                dark: COLORS.PRIMARY_DARK,
                light: COLORS.PRIMARY_LIGHT,
                contrastText: '#ffffff',
            },
            secondary: {
                main: COLORS.SECONDARY,
                dark: COLORS.SECONDARY_DARK,
                light: COLORS.SECONDARY_LIGHT,
            },
            success: {
                main: mode === 'light' ? COLORS.STATUS.SUCCESS : COLORS.STATUS.SUCCESS_DARK,
                contrastText: '#ffffff',
            },
            error: {
                main: mode === 'light' ? COLORS.STATUS.ERROR : COLORS.STATUS.ERROR_DARK,
                contrastText: '#ffffff',
            },
            warning: {
                main: mode === 'light' ? COLORS.STATUS.WARNING : COLORS.STATUS.WARNING_DARK,
                contrastText: '#ffffff',
            },
            info: {
                main: mode === 'light' ? COLORS.STATUS.INFO : COLORS.STATUS.INFO_DARK,
                contrastText: '#ffffff',
            },
            background: {
                default: mode === 'light' ? COLORS.LIGHT.BACKGROUND : COLORS.DARK.BACKGROUND,
                paper: mode === 'light' ? COLORS.LIGHT.PAPER : COLORS.DARK.PAPER,
            },
            text: {
                primary: mode === 'light' ? COLORS.LIGHT.TEXT : COLORS.DARK.TEXT,
            },
            action: {
                hover: mode === 'light' ? COLORS.ACTION.LIGHT.HOVER : COLORS.ACTION.DARK.HOVER,
                selected: mode === 'light' ? COLORS.ACTION.LIGHT.SELECTED : COLORS.ACTION.DARK.SELECTED,
                disabled: mode === 'light' ? COLORS.ACTION.LIGHT.DISABLED : COLORS.ACTION.DARK.DISABLED,
                disabledBackground: mode === 'light'
                    ? COLORS.ACTION.LIGHT.DISABLED_BACKGROUND
                    : COLORS.ACTION.DARK.DISABLED_BACKGROUND,
            },
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: COMPONENT_OVERRIDES.MuiDrawer.paper(mode),
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: COMPONENT_OVERRIDES.MuiAppBar.root,
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'dark' && COMPONENT_OVERRIDES.MuiChip.dark),
                    }),
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'dark' && COMPONENT_OVERRIDES.MuiIconButton.dark),
                    }),
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'dark' && COMPONENT_OVERRIDES.MuiButton.dark),
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