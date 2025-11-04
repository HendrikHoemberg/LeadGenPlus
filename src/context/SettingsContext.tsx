import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { AIProvider, GeminiModel } from '../types';
import { SettingsContext } from './SettingsContext.ts';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>('');
  const [aiProvider, setAiProviderState] = useState<AIProvider>('claude');
  const [geminiModel, setGeminiModelState] = useState<GeminiModel>('gemini-2.5-flash');
  const [darkMode, setDarkMode] = useState<boolean>(true);

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
      toggleDarkMode 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
