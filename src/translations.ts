export type Language = 'en' | 'de';

export interface OutputFieldTemplate {
  label: string;
  enabled: boolean;
  required: boolean;
}

export const translations = {
  en: {
    // Header
    appName: 'LeadGen Plus',
    appSubtitle: 'AI-Powered Lead Generation',
    savedButton: 'Saved',
    historyButton: 'History',
    settingsButton: 'Settings',

    // Main Form
    formTitle: 'Lead Generation Form',
    companyDescription: 'Company Description',
    companyDescriptionPlaceholder: 'Describe your company and what you offer...',
    targetLocations: 'Target Locations',
    locationsPlaceholder: 'e.g., New York, California, Germany...',
    industries: 'Industries',
    industriesPlaceholder: 'e.g., Technology, Healthcare, Finance...',
    companySizeMin: 'Company Size (Min)',
    companySizeMax: 'Company Size (Max)',
    companySizePlaceholder: 'e.g., 10',
    targetPersonas: 'Target Personas',
    personasPlaceholder: 'e.g., CEO, CTO, Marketing Director...',
    additionalCriteria: 'Additional Criteria',
    additionalCriteriaPlaceholder: 'Any other specific requirements...',
    
    // Output Fields Manager
    wantedInformation: 'Wanted Information per Lead',
    required: 'Required',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    addNewField: 'Add new field...',
    requiredFieldsInfo: 'Check "Required" to make fields mandatory for accurate search mode',

    // Search Settings
    searchSettings: 'Search Settings',
    searchMode: 'Search Mode',
    searchModeAccurate: '🎯 Accurate',
    searchModeLoose: '🔍 Loose',
    searchModeAccurateDesc: 'Only leads with all required fields',
    searchModeLooseDesc: 'Include partial matches',
    maxResults: 'Max Results',
    maxResultsDesc: 'Limit: 1-50 leads (controls token usage)',

    // Accurate Search Info
    accurateSearchActive: 'Accurate Search Mode Active',
    noRequiredFields: 'No required fields specified. All enabled fields are optional. Switch to "Loose" mode or mark fields as required.',
    requiredFieldsList: (fields: string) => `Only leads with these required fields will be included: ${fields}. Other fields are optional.`,

    // Buttons
    saveQuery: 'Save Query',
    generateLeads: 'Generate Leads',
    generatingLeads: 'Generating Leads...',
    cancel: 'Cancel',
    save: 'Save',
    loadQuery: 'Load Query',
    downloadPDF: 'Download PDF',
    delete: 'Delete',

    // Messages
    setApiKeyError: (provider: string) => `Please set your ${provider} API key in Settings`,
    fillRequiredFields: 'Please fill in all required fields',
    fillRequiredFieldsSave: 'Please fill in all required fields before saving',
    querySavedSuccess: 'Query saved successfully!',
    leadsGeneratedSuccess: (provider: string) => `Leads generated successfully with ${provider}! Check your downloads.`,
    accurateModeNote: ' (Accurate mode: Only complete leads with all required fields included)',
    
    // Tag Input
    tagInputHelp: 'Press Enter or comma to add, Backspace to remove',

    // Settings Modal
    settingsTitle: 'Settings',
    language: 'Language',
    english: '🇬🇧 English',
    german: '🇩🇪 German',
    aiProvider: 'AI Provider',
    claudeProvider: '🤖 Claude (Anthropic)',
    geminiProvider: '✨ Gemini (Google)',
    anthropicApiKey: 'Anthropic API Key',
    apiKeyPlaceholder: 'sk-ant-...',
    apiKeyStoredLocally: 'Your API key is stored locally in your browser',
    geminiApiKey: 'Google Gemini API Key',
    geminiApiKeyPlaceholder: 'AIza...',
    getGeminiKey: 'Get your free API key at',
    geminiModel: 'Gemini Model',
    flashModel: '⚡ Flash (Faster)',
    proModel: '🧠 Pro (Better)',
    flashModelDesc: 'Fast and efficient for most tasks',
    proModelDesc: 'More capable for complex queries',
    darkMode: 'Dark Mode',

    // Saved Queries Modal
    savedQueriesTitle: 'Saved Queries',
    noSavedQueries: 'No saved queries yet',
    noSavedQueriesDesc: 'Click "Save Query" to save your search parameters here',
    
    // History Modal
    historyTitle: 'Query History',
    historyDescription: 'All queries that have been generated with results. Use "Saved" for manually saved queries.',
    noHistory: 'No generated queries yet',
    noHistoryDesc: 'Generate leads to see them here',
    generated: 'Generated',
    saved: 'Saved',
    
    // Query Details
    locations: 'Locations',
    companySize: 'Company Size',
    personas: 'Personas',
    outputFields: 'Output Fields',
    employees: 'employees',
    any: 'Any',

    // Required field marker
    requiredMarker: '*',
  },
  de: {
    // Header
    appName: 'LeadGen Plus',
    appSubtitle: 'KI-gestützte Lead-Generierung',
    savedButton: 'Gespeichert',
    historyButton: 'Verlauf',
    settingsButton: 'Einstellungen',

    // Main Form
    formTitle: 'Lead-Generierungs-Formular',
    companyDescription: 'Firmenbeschreibung',
    companyDescriptionPlaceholder: 'Beschreiben Sie Ihr Unternehmen und was Sie anbieten...',
    targetLocations: 'Zielstandorte',
    locationsPlaceholder: 'z.B. Berlin, München, Hamburg...',
    industries: 'Branchen',
    industriesPlaceholder: 'z.B. Technologie, Gesundheitswesen, Finanzen...',
    companySizeMin: 'Unternehmensgröße (Min)',
    companySizeMax: 'Unternehmensgröße (Max)',
    companySizePlaceholder: 'z.B. 10',
    targetPersonas: 'Ziel-Personas',
    personasPlaceholder: 'z.B. CEO, CTO, Marketingleiter...',
    additionalCriteria: 'Zusätzliche Kriterien',
    additionalCriteriaPlaceholder: 'Weitere spezifische Anforderungen...',
    
    // Output Fields Manager
    wantedInformation: 'Gewünschte Informationen pro Lead',
    required: 'Erforderlich',
    moveUp: 'Nach oben',
    moveDown: 'Nach unten',
    remove: 'Entfernen',
    addNewField: 'Neues Feld hinzufügen...',
    requiredFieldsInfo: 'Markieren Sie "Erforderlich", um Felder im genauen Suchmodus als Pflichtfelder festzulegen',

    // Search Settings
    searchSettings: 'Sucheinstellungen',
    searchMode: 'Suchmodus',
    searchModeAccurate: '🎯 Genau',
    searchModeLoose: '🔍 Locker',
    searchModeAccurateDesc: 'Nur Leads mit allen erforderlichen Feldern',
    searchModeLooseDesc: 'Teilweise Übereinstimmungen einbeziehen',
    maxResults: 'Max. Ergebnisse',
    maxResultsDesc: 'Limit: 1-50 Leads (steuert Token-Nutzung)',

    // Accurate Search Info
    accurateSearchActive: 'Genauer Suchmodus aktiv',
    noRequiredFields: 'Keine erforderlichen Felder angegeben. Alle aktivierten Felder sind optional. Wechseln Sie zum "Locker"-Modus oder markieren Sie Felder als erforderlich.',
    requiredFieldsList: (fields: string) => `Nur Leads mit diesen erforderlichen Feldern werden einbezogen: ${fields}. Andere Felder sind optional.`,

    // Buttons
    saveQuery: 'Abfrage speichern',
    generateLeads: 'Leads generieren',
    generatingLeads: 'Leads werden generiert...',
    cancel: 'Abbrechen',
    save: 'Speichern',
    loadQuery: 'Abfrage laden',
    downloadPDF: 'PDF herunterladen',
    delete: 'Löschen',

    // Messages
    setApiKeyError: (provider: string) => `Bitte setzen Sie Ihren ${provider} API-Schlüssel in den Einstellungen`,
    fillRequiredFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
    fillRequiredFieldsSave: 'Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie speichern',
    querySavedSuccess: 'Abfrage erfolgreich gespeichert!',
    leadsGeneratedSuccess: (provider: string) => `Leads erfolgreich mit ${provider} generiert! Überprüfen Sie Ihre Downloads.`,
    accurateModeNote: ' (Genauer Modus: Nur vollständige Leads mit allen erforderlichen Feldern enthalten)',
    
    // Tag Input
    tagInputHelp: 'Enter oder Komma zum Hinzufügen drücken, Rücktaste zum Entfernen',

    // Settings Modal
    settingsTitle: 'Einstellungen',
    language: 'Sprache',
    english: '🇬🇧 Englisch',
    german: '🇩🇪 Deutsch',
    aiProvider: 'KI-Anbieter',
    claudeProvider: '🤖 Claude (Anthropic)',
    geminiProvider: '✨ Gemini (Google)',
    anthropicApiKey: 'Anthropic API-Schlüssel',
    apiKeyPlaceholder: 'sk-ant-...',
    apiKeyStoredLocally: 'Ihr API-Schlüssel wird lokal in Ihrem Browser gespeichert',
    geminiApiKey: 'Google Gemini API-Schlüssel',
    geminiApiKeyPlaceholder: 'AIza...',
    getGeminiKey: 'Holen Sie sich Ihren kostenlosen API-Schlüssel unter',
    geminiModel: 'Gemini-Modell',
    flashModel: '⚡ Flash (Schneller)',
    proModel: '🧠 Pro (Besser)',
    flashModelDesc: 'Schnell und effizient für die meisten Aufgaben',
    proModelDesc: 'Leistungsfähiger für komplexe Abfragen',
    darkMode: 'Dunkler Modus',

    // Saved Queries Modal
    savedQueriesTitle: 'Gespeicherte Abfragen',
    noSavedQueries: 'Noch keine gespeicherten Abfragen',
    noSavedQueriesDesc: 'Klicken Sie auf "Abfrage speichern", um Ihre Suchparameter hier zu speichern',
    
    // History Modal
    historyTitle: 'Abfrageverlauf',
    historyDescription: 'Alle Abfragen, die mit Ergebnissen generiert wurden. Verwenden Sie "Gespeichert" für manuell gespeicherte Abfragen.',
    noHistory: 'Noch keine generierten Abfragen',
    noHistoryDesc: 'Generieren Sie Leads, um sie hier zu sehen',
    generated: 'Generiert',
    saved: 'Gespeichert',
    
    // Query Details
    locations: 'Standorte',
    companySize: 'Unternehmensgröße',
    personas: 'Personas',
    outputFields: 'Ausgabefelder',
    employees: 'Mitarbeiter',
    any: 'Beliebig',

    // Required field marker
    requiredMarker: '*',
  }
} as const;

// Default output fields based on language
export const getDefaultOutputFields = (language: Language): OutputFieldTemplate[] => {
  if (language === 'de') {
    return [
      { label: 'Unternehmensname', enabled: true, required: true },
      { label: 'Ansprechpartner (Vor- & Nachname)', enabled: true, required: true },
      { label: 'Position (z. B. HR-Manager, Marketingleiter)', enabled: true, required: false },
      { label: 'Telefonnummer (mit Durchwahl, falls vorhanden)', enabled: true, required: false },
      { label: 'persönliche E-Mail-Adresse ansonsten info@beispiel.com', enabled: true, required: false },
      { label: 'Ort', enabled: true, required: false },
      { label: 'Website', enabled: true, required: false },
    ];
  } else {
    return [
      { label: 'Company Name', enabled: true, required: true },
      { label: 'Contact Person (First & Last Name)', enabled: true, required: true },
      { label: 'Position (e.g., HR Manager, Marketing Director)', enabled: true, required: false },
      { label: 'Phone Number (with extension if available)', enabled: true, required: false },
      { label: 'Personal Email Address or info@example.com', enabled: true, required: false },
      { label: 'Location', enabled: true, required: false },
      { label: 'Website', enabled: true, required: false },
    ];
  }
};

export const useTranslation = (language: Language) => {
  return translations[language];
};
