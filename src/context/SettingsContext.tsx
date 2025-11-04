import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { AIProvider, GeminiModel, Language } from '../types';
import { SettingsContext } from './SettingsContext.ts';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>('');
  const [aiProvider, setAiProviderState] = useState<AIProvider>('gemini');
  const [geminiModel, setGeminiModelState] = useState<GeminiModel>('gemini-2.5-pro');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
    
    const savedGeminiApiKey = localStorage.getItem('gemini_api_key');
    if (savedGeminiApiKey) {
      setGeminiApiKeyState(savedGeminiApiKey);
    }
    
    const savedAiProvider = localStorage.getItem('ai_provider');
    if (savedAiProvider === 'claude' || savedAiProvider === 'gemini') {
      setAiProviderState(savedAiProvider);
    }
    
    const savedGeminiModel = localStorage.getItem('gemini_model');
    if (savedGeminiModel === 'gemini-2.5-flash' || savedGeminiModel === 'gemini-2.5-pro') {
      setGeminiModelState(savedGeminiModel);
    }
    
    const savedDarkMode = localStorage.getItem('dark_mode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'de') {
      setLanguageState(savedLanguage);
    } else {
      // If no language is saved, default to English and save it
      localStorage.setItem('language', 'en');
      setLanguageState('en');
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('anthropic_api_key', key);
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const setAiProvider = (provider: AIProvider) => {
    setAiProviderState(provider);
    localStorage.setItem('ai_provider', provider);
  };

  const setGeminiModel = (model: GeminiModel) => {
    setGeminiModelState(model);
    localStorage.setItem('gemini_model', model);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('dark_mode', String(newValue));
      return newValue;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <SettingsContext.Provider value={{ 
      apiKey, 
      setApiKey, 
      geminiApiKey, 
      setGeminiApiKey,
      aiProvider,
      setAiProvider,
      geminiModel,
      setGeminiModel,
      darkMode, 
      toggleDarkMode,
      language,
      setLanguage
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
