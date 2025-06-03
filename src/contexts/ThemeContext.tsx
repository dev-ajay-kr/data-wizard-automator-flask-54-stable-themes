
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'default' | 'classic' | 'nature' | 'neon' | 'brown';

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
  default: {
    name: 'default',
    displayName: 'Default',
    description: 'Clean modern design',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#8B5CF6',
      background: '#FFFFFF'
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      textColor: '#1F2937'
    }
  },
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
  // Initialize state with default values to prevent null errors
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');

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

  // Apply dark mode to DOM
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      const root = document.documentElement;
      
      if (darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Error applying dark mode:', error);
    }
  }, [darkMode]);

  // Apply theme to DOM
  useEffect(() => {
    try {
      localStorage.setItem('currentTheme', currentTheme);
      const theme = themes[currentTheme];
      const root = document.documentElement;
      
      // Apply theme colors as CSS variables
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-secondary', theme.colors.secondary);
      root.style.setProperty('--theme-accent', theme.colors.accent);
      root.style.setProperty('--theme-background', theme.colors.background);
      root.style.setProperty('--theme-text', theme.typography.textColor);
      root.style.setProperty('--theme-font', theme.typography.fontFamily);
      
      // Apply theme class and data attribute
      Object.keys(themes).forEach(themeName => {
        root.classList.remove(`theme-${themeName}`);
      });
      root.classList.add(`theme-${currentTheme}`);
      root.setAttribute('data-theme', currentTheme);
      
      console.log(`Applied theme: ${currentTheme}`, theme);
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  }, [currentTheme]);

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
