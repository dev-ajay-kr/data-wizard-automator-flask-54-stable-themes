
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

export const useTheme = () => {
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
  const [darkMode, setDarkModeState] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedTheme = localStorage.getItem('currentTheme') as ThemeName;
    
    if (savedDarkMode) {
      setDarkModeState(JSON.parse(savedDarkMode));
    }
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('currentTheme', currentTheme);
    // Apply theme CSS variables
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    
    // Apply theme class
    Object.keys(themes).forEach(themeName => {
      root.classList.remove(`theme-${themeName}`);
    });
    root.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  const toggleDarkMode = () => {
    setDarkModeState(!darkMode);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
  };

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      setDarkMode, 
      currentTheme, 
      setTheme, 
      availableThemes: Object.values(themes) 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
