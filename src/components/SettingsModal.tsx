import React from 'react';
import { useSettings } from '../context/useSettings';
import { useTranslation } from '../translations';
import type { AIProvider, GeminiModel, Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
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
  } = useSettings();
  
  const t = useTranslation(language);
  
  const [tempApiKey, setTempApiKey] = React.useState(apiKey);
  const [tempGeminiApiKey, setTempGeminiApiKey] = React.useState(geminiApiKey);
  const [tempAiProvider, setTempAiProvider] = React.useState<AIProvider>(aiProvider);
  const [tempGeminiModel, setTempGeminiModel] = React.useState<GeminiModel>(geminiModel);
  const [tempLanguage, setTempLanguage] = React.useState<Language>(language);

  React.useEffect(() => {
    setTempApiKey(apiKey);
    setTempGeminiApiKey(geminiApiKey);
    setTempAiProvider(aiProvider);
    setTempGeminiModel(geminiModel);
    setTempLanguage(language);
  }, [apiKey, geminiApiKey, aiProvider, geminiModel, language]);

  const handleSave = () => {
    setApiKey(tempApiKey);
    setGeminiApiKey(tempGeminiApiKey);
    setAiProvider(tempAiProvider);
    setGeminiModel(tempGeminiModel);
    setLanguage(tempLanguage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 rounded-lg p-2 transition-colors ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t.settingsTitle}
        </h2>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.language}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTempLanguage('en')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  tempLanguage === 'en'
                    ? darkMode
                      ? 'bg-green-600 text-white border-2 border-green-500'
                      : 'bg-green-500 text-white border-2 border-green-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                }`}
              >
                {t.english}
              </button>
              <button
                type="button"
                onClick={() => setTempLanguage('de')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  tempLanguage === 'de'
                    ? darkMode
                      ? 'bg-green-600 text-white border-2 border-green-500'
                      : 'bg-green-500 text-white border-2 border-green-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                }`}
              >
                {t.german}
              </button>
            </div>
          </div>

          {/* AI Provider Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.aiProvider}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTempAiProvider('claude')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  tempAiProvider === 'claude'
                    ? darkMode
                      ? 'bg-purple-600 text-white border-2 border-purple-500'
                      : 'bg-purple-500 text-white border-2 border-purple-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                }`}
              >
                {t.claudeProvider}
              </button>
              <button
                type="button"
                onClick={() => setTempAiProvider('gemini')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  tempAiProvider === 'gemini'
                    ? darkMode
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-blue-500 text-white border-2 border-blue-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                }`}
              >
                {t.geminiProvider}
              </button>
            </div>
          </div>

          {/* Claude Settings */}
          {tempAiProvider === 'claude' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.anthropicApiKey}
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
              <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.apiKeyStoredLocally}
              </p>
            </div>
          )}

          {/* Gemini Settings */}
          {tempAiProvider === 'gemini' && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.geminiApiKey}
                </label>
                <input
                  type="password"
                  value={tempGeminiApiKey}
                  onChange={(e) => setTempGeminiApiKey(e.target.value)}
                  placeholder={t.geminiApiKeyPlaceholder}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.getGeminiKey} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.geminiModel}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTempGeminiModel('gemini-2.5-flash')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      tempGeminiModel === 'gemini-2.5-flash'
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t.flashModel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempGeminiModel('gemini-2.5-pro')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      tempGeminiModel === 'gemini-2.5-pro'
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t.proModel}
                  </button>
                </div>
                <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tempGeminiModel === 'gemini-2.5-flash' ? t.flashModelDesc : t.proModelDesc}
                </p>
              </div>
            </>
          )}

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-600">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.darkMode}
            </span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-lg font-medium bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
