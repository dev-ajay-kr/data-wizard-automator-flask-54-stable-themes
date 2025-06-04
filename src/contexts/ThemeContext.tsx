
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'classic' | 'nature' | 'neon' | 'brown';

interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    textColor: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  classic: {
    name: 'classic',
    displayName: 'Classic Minimalistic',
    description: 'Subtle purple tones with clean typography',
    colors: {
      primary: '#B1B2FF',
      secondary: '#AAC4FF',
      accent: '#D2DAFF',
      background: '#EEF1FF'
    },
    typography: {
      fontFamily: 'Inter, Helvetica, sans-serif',
      textColor: '#222222'
    }
  },
  nature: {
    name: 'nature',
    displayName: '3D Nature Minimalism',
    description: 'Earthy greens with organic feel',
    colors: {
      primary: '#537D5D',
      secondary: '#73946B',
      accent: '#9EBC8A',
      background: '#D2D0A0'
    },
    typography: {
      fontFamily: 'Georgia, Source Serif Pro, serif',
      textColor: '#2D4A32'
    }
  },
  neon: {
    name: 'neon',
    displayName: 'Futuristic Neon Parallax',
    description: 'High contrast neon on dark backgrounds',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#00FF00',
      background: '#000000'
    },
    typography: {
      fontFamily: 'Orbitron, Space Mono, monospace',
      textColor: '#EEEEEE'
    }
  },
  brown: {
    name: 'brown',
    displayName: '3D Minimalist Brown',
    description: 'Warm neutral tones with tactile feel',
    colors: {
      primary: '#8D7B68',
      secondary: '#A4907C',
      accent: '#C8B6A6',
      background: '#F1DEC9'
    },
    typography: {
      fontFamily: 'Lora, Nunito, serif',
      textColor: '#3C2E24'
    }
  }
};

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
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
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('classic');

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      const savedTheme = localStorage.getItem('currentTheme') as ThemeName;
      
      if (savedDarkMode !== null) {
        setDarkModeState(JSON.parse(savedDarkMode));
      }
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.warn('Error loading theme preferences:', error);
    }
  }, []);

  // Enhanced theme application
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      localStorage.setItem('currentTheme', currentTheme);
      
      const root = document.documentElement;
      const body = document.body;
      
      // Remove all existing theme classes first
      Object.keys(themes).forEach(themeName => {
        root.classList.remove(`theme-${themeName}`);
        body.classList.remove(`theme-${themeName}`);
      });
      root.classList.remove('dark');
      body.classList.remove('dark');
      
      // Apply the selected theme
      root.classList.add(`theme-${currentTheme}`);
      body.classList.add(`theme-${currentTheme}`);
      
      // Apply dark mode if enabled (works with any theme)
      if (darkMode) {
        root.classList.add('dark');
        body.classList.add('dark');
      }

      const theme = themes[currentTheme];
      
      // Apply theme colors as CSS variables
      const vars = [
        ['--theme-primary', theme.colors.primary],
        ['--theme-secondary', theme.colors.secondary],
        ['--theme-accent', theme.colors.accent],
        ['--theme-background', darkMode ? '#111827' : theme.colors.background],
        ['--theme-text', darkMode ? '#F9FAFB' : theme.typography.textColor],
        ['--theme-font', theme.typography.fontFamily]
      ];

      vars.forEach(([property, value]) => {
        root.style.setProperty(property, value);
        body.style.setProperty(property, value);
      });
      
      // Set theme-specific RGB values for animations
      const rgbMap: Record<ThemeName, { primary: string, secondary: string, accent: string }> = {
        classic: { primary: '177, 178, 255', secondary: '170, 196, 255', accent: '210, 218, 255' },
        nature: { primary: '83, 125, 93', secondary: '115, 148, 107', accent: '158, 188, 138' },
        neon: { primary: '0, 255, 255', secondary: '255, 0, 255', accent: '0, 255, 0' },
        brown: { primary: '141, 123, 104', secondary: '164, 144, 124', accent: '200, 182, 166' }
      };

      const rgb = rgbMap[currentTheme];
      root.style.setProperty('--theme-primary-rgb', rgb.primary);
      root.style.setProperty('--theme-secondary-rgb', rgb.secondary);
      root.style.setProperty('--theme-accent-rgb', rgb.accent);
      
      root.setAttribute('data-theme', currentTheme);
      body.setAttribute('data-theme', currentTheme);
      
      // Force update body styles
      body.style.backgroundColor = darkMode ? '#111827' : theme.colors.background;
      body.style.color = darkMode ? '#F9FAFB' : theme.typography.textColor;
      body.style.fontFamily = theme.typography.fontFamily;
      
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  }, [currentTheme, darkMode]);

  const toggleDarkMode = () => {
    setDarkModeState(prev => !prev);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
  };

  const setTheme = (theme: ThemeName) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
    } else {
      console.warn(`Theme '${theme}' not found`);
    }
  };

  const contextValue: ThemeContextType = {
    darkMode,
    toggleDarkMode,
    setDarkMode,
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
