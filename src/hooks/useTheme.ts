
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = () => {
  const { currentTheme, availableThemes } = useTheme();
  const theme = availableThemes.find(t => t.name === currentTheme);
  
  return {
    colors: theme?.colors || {},
    isDark: currentTheme?.includes('dark') || false,
    isLight: !currentTheme?.includes('dark')
  };
};
