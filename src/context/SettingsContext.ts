import { createContext } from 'react';
import type { AIProvider, GeminiModel, Language } from '../types';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  aiProvider: AIProvider;
  setAiProvider: (provider: AIProvider) => void;
  geminiModel: GeminiModel;
  setGeminiModel: (model: GeminiModel) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export type { SettingsContextType };

