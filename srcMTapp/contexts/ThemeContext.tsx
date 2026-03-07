import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'day' | 'dark' | 'lightblue' | 'nature';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getThemeColors: () => ThemeColors;
}

interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  cardBg: string;
  gradient: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfig: Record<ThemeType, ThemeColors> = {
  day: {
    background: 'bg-[#FFF5F0]',
    primary: 'bg-[#FF8A65]',
    secondary: 'bg-[#FFB74D]',
    accent: 'bg-[#FFCCBC]',
    text: 'text-[#4A3428]',
    cardBg: 'bg-white/80',
    gradient: 'from-[#FF8A65] via-[#FFB74D] to-[#FF8A65]',
  },
  dark: {
    background: 'bg-black',
    primary: 'bg-green-400',
    secondary: 'bg-blue-400',
    accent: 'bg-gradient-to-br from-green-400/20 to-blue-400/20',
    text: 'text-green-50',
    cardBg: 'bg-gradient-to-br from-green-900/40 to-blue-900/40',
    gradient: 'from-green-400 to-blue-400',
  },
  lightblue: {
    background: 'bg-[#E3F2FD]',
    primary: 'bg-[#64B5F6]',
    secondary: 'bg-[#90CAF9]',
    accent: 'bg-[#BBDEFB]',
    text: 'text-[#1565C0]',
    cardBg: 'bg-white/80',
    gradient: 'from-[#64B5F6] via-[#90CAF9] to-[#64B5F6]',
  },
  nature: {
    background: 'bg-[#F0F8F5]',
    primary: 'bg-[#81C784]',
    secondary: 'bg-[#AED581]',
    accent: 'bg-[#E0F2E9]',
    text: 'text-[#43A047]',
    cardBg: 'bg-white/80',
    gradient: 'from-[#81C784] via-[#AED581] to-[#81C784]',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('day');

  const getThemeColors = () => themeConfig[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}