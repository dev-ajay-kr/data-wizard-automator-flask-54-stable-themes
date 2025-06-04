
import { ThemeName } from '@/types/theme';
import { themes } from '@/constants/themes';

export const applyThemeVariables = (themeName: ThemeName, darkMode: boolean) => {
  const root = document.documentElement;
  const body = document.body;
  
  // Remove all existing theme classes
  Object.keys(themes).forEach(name => {
    root.classList.remove(`theme-${name}`);
    body.classList.remove(`theme-${name}`);
  });
  root.classList.remove('dark');
  body.classList.remove('dark');
  
  // Apply the selected theme
  root.classList.add(`theme-${themeName}`);
  body.classList.add(`theme-${themeName}`);
  
  // Apply dark mode if enabled
  if (darkMode) {
    root.classList.add('dark');
    body.classList.add('dark');
  }

  const theme = themes[themeName];
  
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

  const rgb = rgbMap[themeName];
  root.style.setProperty('--theme-primary-rgb', rgb.primary);
  root.style.setProperty('--theme-secondary-rgb', rgb.secondary);
  root.style.setProperty('--theme-accent-rgb', rgb.accent);
  
  root.setAttribute('data-theme', themeName);
  body.setAttribute('data-theme', themeName);
  
  // Force update body styles
  body.style.backgroundColor = darkMode ? '#111827' : theme.colors.background;
  body.style.color = darkMode ? '#F9FAFB' : theme.typography.textColor;
  body.style.fontFamily = theme.typography.fontFamily;
};

export const loadThemePreferences = (): { darkMode: boolean; theme: ThemeName } => {
  try {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedTheme = localStorage.getItem('currentTheme') as ThemeName;
    
    return {
      darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false,
      theme: savedTheme && themes[savedTheme] ? savedTheme : 'classic'
    };
  } catch (error) {
    console.warn('Error loading theme preferences:', error);
    return { darkMode: false, theme: 'classic' };
  }
};

export const saveThemePreferences = (darkMode: boolean, theme: ThemeName) => {
  try {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('currentTheme', theme);
  } catch (error) {
    console.warn('Error saving theme preferences:', error);
  }
};
