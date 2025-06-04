
export type ThemeName = 'classic' | 'nature' | 'neon' | 'brown';

export interface Theme {
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
