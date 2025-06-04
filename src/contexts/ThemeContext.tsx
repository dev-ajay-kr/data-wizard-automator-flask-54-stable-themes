
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, Theme } from '@/types/theme';
import { themes } from '@/constants/themes';
import { applyThemeVariables, loadThemePreferences, saveThemePreferences } from '@/utils/themeUtils';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('classic');

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = loadThemePreferences();
    setCurrentTheme(savedTheme);
  }, []);

  // Apply theme changes
  useEffect(() => {
    saveThemePreferences(currentTheme);
    applyThemeVariables(currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
    } else {
      console.warn(`Theme '${theme}' not found`);
    }
  };

  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes)
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { themes, type ThemeName, type Theme };
