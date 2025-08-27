// frontend/src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('islamicPlatformTheme');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('islamicPlatformTheme', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0f172a';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#f8fafc';
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Islamic-inspired color palette
    const theme = {
        colors: {
            primary: {
                light: 'emerald-600',
                dark: 'emerald-400',
                gradient: 'from-emerald-600 via-teal-600 to-cyan-600'
            },
            secondary: {
                light: 'amber-500',
                dark: 'amber-400',
                gradient: 'from-amber-400 to-orange-500'
            },
            accent: {
                light: 'rose-500',
                dark: 'rose-400'
            },
            background: {
                light: 'slate-50',
                dark: 'slate-900',
                gradient: {
                    light: 'from-emerald-50 via-teal-50 to-cyan-50',
                    dark: 'from-slate-900 via-slate-800 to-slate-900'
                }
            },
            surface: {
                light: 'white',
                dark: 'slate-800',
                glass: {
                    light: 'bg-white/70 backdrop-blur-sm',
                    dark: 'bg-slate-800/70 backdrop-blur-sm'
                }
            },
            text: {
                primary: {
                    light: 'slate-900',
                    dark: 'slate-100'
                },
                secondary: {
                    light: 'slate-600',
                    dark: 'slate-300'
                },
                muted: {
                    light: 'slate-500',
                    dark: 'slate-400'
                }
            },
            border: {
                light: 'emerald-200',
                dark: 'slate-700'
            }
        },
        shadows: {
            light: 'shadow-lg shadow-emerald-100/50',
            dark: 'shadow-lg shadow-slate-900/50'
        },
        animations: {
            hover: 'transition-all duration-300 transform hover:scale-105',
            fade: 'transition-opacity duration-300',
            slide: 'transition-transform duration-300'
        }
    };

    const getThemeClasses = (type, variant = 'light') => {
        const mode = isDarkMode ? 'dark' : 'light';
        return theme.colors[type]?.[mode] || theme.colors[type]?.[variant] || '';
    };

    const value = {
        isDarkMode,
        toggleDarkMode,
        theme,
        getThemeClasses
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
