import { createContext } from 'react';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export type { SettingsContextType };
