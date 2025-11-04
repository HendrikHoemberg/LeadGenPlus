import React from 'react';
import { useSettings } from '../context/useSettings';
import type { LeadQuery } from '../types';
import { downloadPDF } from '../utils/claudeAPI';

interface SavedQueriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadQuery: (query: LeadQuery) => void;
}

const SavedQueriesModal: React.FC<SavedQueriesModalProps> = ({ isOpen, onClose, onLoadQuery }) => {
  const { darkMode } = useSettings();
  const [queries, setQueries] = React.useState<LeadQuery[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const savedQueries = localStorage.getItem('savedQueries');
      if (savedQueries) {
        // Only show queries with PDF data (completed generations)
        const allQueries: LeadQuery[] = JSON.parse(savedQueries);
        setQueries(allQueries.filter(q => q.pdfData));
      }
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    const savedQueries = localStorage.getItem('savedQueries');
    if (savedQueries) {
      const allQueries: LeadQuery[] = JSON.parse(savedQueries);
      const updatedQueries = allQueries.filter(q => q.id !== id);
      localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
      setQueries(updatedQueries.filter(q => q.pdfData));
    }
  };

  const handleExport = (query: LeadQuery) => {
    if (query.pdfData) {
      downloadPDF(query.pdfData, `leads_${query.id}.pdf`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 overflow-hidden flex flex-col`}>
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
          Saved Queries
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4">
          {queries.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="mx-auto h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-lg">No saved queries with results yet</p>
              <p className="text-sm mt-2">Generate leads to save them here</p>
            </div>
          ) : (
            queries.map((query) => (
              <div
                key={query.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                      {new Date(query.timestamp).toLocaleString()}
                    </p>
                    <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {query.companyDescription.substring(0, 60)}...
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    <svg className="w-3 h-3 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Generated
                  </div>
                </div>
                
                <div className={`text-sm space-y-1 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p><span className="font-medium">Locations:</span> {query.locations.join(', ')}</p>
                  <p><span className="font-medium">Industries:</span> {query.industry.join(', ')}</p>
                  <p>
                    <span className="font-medium">Company Size:</span> {query.companySizeMin || 'Any'} - {query.companySizeMax || 'Any'} employees
                  </p>
                  {query.personas.length > 0 && (
                    <p><span className="font-medium">Personas:</span> {query.personas.join(', ')}</p>
                  )}
                  {query.searchMode && (
                    <p>
                      <span className="font-medium">Search Mode:</span>{' '}
                      <span className={query.searchMode === 'accurate' ? 'text-blue-500' : 'text-purple-500'}>
                        {query.searchMode === 'accurate' ? '🎯 Accurate' : '🔍 Loose'}
                      </span>
                    </p>
                  )}
                  {query.maxResults && (
                    <p><span className="font-medium">Max Results:</span> {query.maxResults}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onLoadQuery(query);
                      onClose();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Load Query
                  </button>
                  <button
                    onClick={() => handleExport(query)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDelete(query.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedQueriesModal;
