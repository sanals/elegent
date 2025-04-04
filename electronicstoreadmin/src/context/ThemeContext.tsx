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
            background: {
                default: mode === 'light' ? COLORS.LIGHT_BG : COLORS.DARK_BG,
                paper: mode === 'light' ? COLORS.LIGHT_PAPER : COLORS.DARK_PAPER,
            },
            text: {
                primary: mode === 'light' ? COLORS.LIGHT_TEXT : COLORS.DARK_TEXT,
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