import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const lightTheme = {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    primary: '#1E3A8A',
    primaryLight: '#DBEAFE',
    border: '#E2E8F0',
    statusBg: '#F1F5F9',
    iconBackground: '#F1F5F9',
    statusBar: 'dark',
};

export const darkTheme = {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    primary: '#3B82F6',
    primaryLight: '#1E3A8A',
    border: '#334155',
    statusBg: '#334155',
    iconBackground: '#334155',
    statusBar: 'light',
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
