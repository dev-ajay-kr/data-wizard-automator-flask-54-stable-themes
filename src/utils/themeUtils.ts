
import { ThemeName } from '@/types/theme';
import { themes } from '@/constants/themes';

export const applyThemeVariables = (themeName: ThemeName) => {
  const root = document.documentElement;
  const body = document.body;
  
  // Remove all existing theme classes
  Object.keys(themes).forEach(name => {
    root.classList.remove(`theme-${name}`);
    body.classList.remove(`theme-${name}`);
  });
  
  // Apply the selected theme
  root.classList.add(`theme-${themeName}`);
  body.classList.add(`theme-${themeName}`);

  const theme = themes[themeName];
  
  // Apply theme colors as CSS variables
  const vars = [
    ['--theme-primary', theme.colors.primary],
    ['--theme-secondary', theme.colors.secondary],
    ['--theme-accent', theme.colors.accent],
    ['--theme-background', theme.colors.background],
    ['--theme-text', theme.typography.textColor],
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
  body.style.backgroundColor = theme.colors.background;
  body.style.color = theme.typography.textColor;
  body.style.fontFamily = theme.typography.fontFamily;
};

export const loadThemePreferences = (): ThemeName => {
  try {
    const savedTheme = localStorage.getItem('currentTheme') as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : 'classic';
  } catch (error) {
    console.warn('Error loading theme preferences:', error);
    return 'classic';
  }
};

export const saveThemePreferences = (theme: ThemeName) => {
  try {
    localStorage.setItem('currentTheme', theme);
  } catch (error) {
    console.warn('Error saving theme preferences:', error);
  }
};
