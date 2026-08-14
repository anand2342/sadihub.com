import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('wedding_theme');
        if (saved === 'royal-wedding' || saved === 'light' || saved === 'dark')
            return saved;
        return 'royal-wedding'; // Default to Shahi Vivah Grand Shaadi Vibe!
    });
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'royal-wedding');
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else if (theme === 'royal-wedding') {
            root.classList.add('royal-wedding');
        }
        localStorage.setItem('wedding_theme', theme);
    }, [theme]);
    const setThemeMode = (mode) => {
        setTheme(mode);
    };
    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'royal-wedding')
                return 'light';
            if (prev === 'light')
                return 'dark';
            return 'royal-wedding';
        });
    };
    return (<ThemeContext.Provider value={{ theme, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>);
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
