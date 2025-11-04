import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { SettingsContext } from './SettingsContext.ts';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
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

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('dark_mode', String(newValue));
      return newValue;
    });
  };

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, darkMode, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
