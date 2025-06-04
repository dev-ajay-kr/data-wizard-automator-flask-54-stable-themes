
import { Theme, ThemeName } from '@/types/theme';

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
