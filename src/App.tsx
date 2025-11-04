import { useEffect, useState } from 'react';
import HistoryModal from './components/HistoryModal';
import OutputFieldsManager from './components/OutputFieldsManager';
import SavedQueriesModal from './components/SavedQueriesModal';
import SettingsModal from './components/SettingsModal';
import TagInput from './components/TagInput';
import { useSettings } from './context/useSettings';
import { getDefaultOutputFields, useTranslation } from './translations';
import type { FormData, LeadQuery, OutputField } from './types';
import { downloadPDF, generateLeads } from './utils/apiService';

function App() {
  const { apiKey, geminiApiKey, aiProvider, geminiModel, darkMode, language } = useSettings();
  const t = useTranslation(language);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedQueriesOpen, setSavedQueriesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyDescription: '',
    locations: [],
    industry: [],
    companySizeMin: '',
    companySizeMax: '',
    personas: [],
    additionalCriteria: '',
    outputFields: [],
    searchMode: 'accurate',
    maxResults: 10,
  });

  // Initialize output fields with correct language on first load
  useEffect(() => {
    if (!isInitialized) {
      setFormData(prev => ({
        ...prev,
        outputFields: getDefaultOutputFields(language).map((field, index) => ({
          id: (index + 1).toString(),
          ...field
        }))
      }));
      setIsInitialized(true);
    }
  }, [language, isInitialized]);

  // Update output fields when language changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      setFormData(prev => ({
        ...prev,
        outputFields: getDefaultOutputFields(language).map((field, index) => ({
          id: (index + 1).toString(),
          ...field
        }))
      }));
    }
  }, [language, isInitialized]);

  const handleInputChange = (field: keyof FormData, value: string | string[] | OutputField[] | number | 'accurate' | 'loose') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (field: 'locations' | 'industry' | 'personas', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleRemoveTag = (field: 'locations' | 'industry' | 'personas', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleLoadQuery = (query: LeadQuery) => {
    setFormData({
      companyDescription: query.companyDescription,
      locations: query.locations,
      industry: query.industry,
      companySizeMin: query.companySizeMin,
      companySizeMax: query.companySizeMax,
      personas: query.personas,
      additionalCriteria: query.additionalCriteria,
      outputFields: query.outputFields || getDefaultOutputFields(language).map((field, index) => ({
        id: (index + 1).toString(),
        ...field
      })),
      searchMode: query.searchMode || 'accurate',
      maxResults: query.maxResults || 10,
    });
  };

  const saveQuery = (pdfData?: string) => {
    const query: LeadQuery = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...formData,
      pdfData,
    };

    // Save to history (all queries including generated ones)
    const savedQueries = localStorage.getItem('savedQueries');
    const queries = savedQueries ? JSON.parse(savedQueries) : [];
    queries.unshift(query);
    localStorage.setItem('savedQueries', JSON.stringify(queries));
  };

  const handleSaveQuery = () => {
    if (!formData.companyDescription || formData.locations.length === 0 || formData.industry.length === 0) {
      setError(t.fillRequiredFieldsSave);
      return;
    }

    // Save manually to the "Saved Queries" section (without PDF data)
    const query: LeadQuery = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...formData,
    };

    const manualSavedQueries = localStorage.getItem('manualSavedQueries');
    const queries = manualSavedQueries ? JSON.parse(manualSavedQueries) : [];
    queries.unshift(query);
    localStorage.setItem('manualSavedQueries', JSON.stringify(queries));

    setSuccess(t.querySavedSuccess);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleGenerateLeads = async () => {
    // Validate API key based on provider
    const currentApiKey = aiProvider === 'claude' ? apiKey : geminiApiKey;
    const providerName = aiProvider === 'claude' ? 'Anthropic' : 'Google Gemini';
    
    if (!currentApiKey) {
      setError(t.setApiKeyError(providerName));
      return;
    }

    if (!formData.companyDescription || formData.locations.length === 0 || formData.industry.length === 0) {
      setError(t.fillRequiredFields);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await generateLeads(formData, aiProvider, currentApiKey, geminiModel);
      saveQuery(result.pdfBase64);
      downloadPDF(result.pdfBase64, `leads_${Date.now()}.pdf`);
      
      let successMessage = t.leadsGeneratedSuccess(providerName);
      if (formData.searchMode === 'accurate') {
        successMessage += t.accurateModeNote;
      }
      
      setSuccess(successMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t.appName}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.appSubtitle}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSavedQueriesOpen(true)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                } shadow-md hover:shadow-lg`}
              >
                <svg className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {t.savedButton}
              </button>
              <button
                onClick={() => setHistoryOpen(true)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                } shadow-md hover:shadow-lg`}
              >
                <svg className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.historyButton}
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                } shadow-md hover:shadow-lg`}
              >
                <svg className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.settingsButton}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-2xl shadow-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.formTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Description */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.companyDescription} {t.requiredMarker}
              </label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder={t.companyDescriptionPlaceholder}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            {/* Locations */}
            <div className="md:col-span-2">
              <TagInput
                label={t.targetLocations}
                placeholder={t.locationsPlaceholder}
                tags={formData.locations}
                onAddTag={(value) => handleAddTag('locations', value)}
                onRemoveTag={(index) => handleRemoveTag('locations', index)}
                required
              />
            </div>

            {/* Industry */}
            <div className="md:col-span-2">
              <TagInput
                label={t.industries}
                placeholder={t.industriesPlaceholder}
                tags={formData.industry}
                onAddTag={(value) => handleAddTag('industry', value)}
                onRemoveTag={(index) => handleRemoveTag('industry', index)}
                required
              />
            </div>

            {/* Company Size */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.companySizeMin}
              </label>
              <input
                type="number"
                value={formData.companySizeMin}
                onChange={(e) => handleInputChange('companySizeMin', e.target.value)}
                placeholder={t.companySizePlaceholder}
                min="0"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.companySizeMax}
              </label>
              <input
                type="number"
                value={formData.companySizeMax}
                onChange={(e) => handleInputChange('companySizeMax', e.target.value)}
                placeholder={t.companySizePlaceholder}
                min="0"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            {/* Personas */}
            <div className="md:col-span-2">
              <TagInput
                label={t.targetPersonas}
                placeholder={t.personasPlaceholder}
                tags={formData.personas}
                onAddTag={(value) => handleAddTag('personas', value)}
                onRemoveTag={(index) => handleRemoveTag('personas', index)}
              />
            </div>

            {/* Additional Criteria */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.additionalCriteria}
              </label>
              <textarea
                value={formData.additionalCriteria}
                onChange={(e) => handleInputChange('additionalCriteria', e.target.value)}
                placeholder={t.additionalCriteriaPlaceholder}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            {/* Output Fields */}
            <div className="md:col-span-2">
              <OutputFieldsManager
                fields={formData.outputFields}
                onFieldsChange={(fields) => handleInputChange('outputFields', fields)}
              />
            </div>

            {/* Search Settings */}
            <div className="md:col-span-2">
              <div className={`rounded-lg border-2 p-4 space-y-4 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.searchSettings}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search Mode */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.searchMode}
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('searchMode', 'accurate')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.searchMode === 'accurate'
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : darkMode
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {t.searchModeAccurate}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('searchMode', 'loose')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.searchMode === 'loose'
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : darkMode
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {t.searchModeLoose}
                      </button>
                    </div>
                    <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.searchMode === 'accurate' 
                        ? t.searchModeAccurateDesc
                        : t.searchModeLooseDesc}
                    </p>
                  </div>

                  {/* Max Results */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.maxResults}
                    </label>
                    <input
                      type="number"
                      value={formData.maxResults}
                      onChange={(e) => handleInputChange('maxResults', Math.max(1, Math.min(50, parseInt(e.target.value) || 10)))}
                      min="1"
                      max="50"
                      className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${
                        darkMode
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                    <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.maxResultsDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Mode Info */}
          {formData.searchMode === 'accurate' && (
            <div className={`mt-6 p-4 rounded-lg border-2 ${
              darkMode 
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                : 'bg-blue-50 border-blue-300 text-blue-700'
            }`}>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.accurateSearchActive}</p>
                  <p className="text-xs mt-1 opacity-90">
                    {(() => {
                      const requiredFields = formData.outputFields.filter(f => f.enabled && f.required);
                      if (requiredFields.length === 0) {
                        return t.noRequiredFields;
                      }
                      return t.requiredFieldsList(requiredFields.map(f => f.label).join(', '));
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 text-red-500">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border-2 border-green-500/50 text-green-500">
              <p className="font-medium">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveQuery}
              disabled={loading}
              className={`flex-1 sm:flex-none px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              <svg className="w-6 h-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {t.saveQuery}
            </button>
            <button
              onClick={handleGenerateLeads}
              disabled={loading}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.generatingLeads}
                </span>
              ) : (
                t.generateLeads
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SavedQueriesModal isOpen={savedQueriesOpen} onClose={() => setSavedQueriesOpen(false)} onLoadQuery={handleLoadQuery} />
      <HistoryModal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onLoadQuery={handleLoadQuery} />
    </div>
  );
}

export default App;
