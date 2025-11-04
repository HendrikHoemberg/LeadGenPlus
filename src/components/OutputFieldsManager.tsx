import React, { useState } from 'react';
import { useSettings } from '../context/useSettings';
import type { OutputField } from '../types';

interface OutputFieldsManagerProps {
  fields: OutputField[];
  onFieldsChange: (fields: OutputField[]) => void;
}

const OutputFieldsManager: React.FC<OutputFieldsManagerProps> = ({ fields, onFieldsChange }) => {
  const { darkMode } = useSettings();
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const toggleField = (id: string) => {
    onFieldsChange(
      fields.map(field =>
        field.id === id ? { ...field, enabled: !field.enabled } : field
      )
    );
  };

  const toggleRequired = (id: string) => {
    onFieldsChange(
      fields.map(field =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter(field => field.id !== id));
  };

  const addField = () => {
    if (newFieldLabel.trim()) {
      const newField: OutputField = {
        id: Date.now().toString(),
        label: newFieldLabel.trim(),
        enabled: true,
        required: false,
      };
      onFieldsChange([...fields, newField]);
      setNewFieldLabel('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addField();
    }
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      onFieldsChange(newFields);
    }
  };

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Wanted Information per Lead
      </label>
      
      <div className={`rounded-lg border-2 p-4 space-y-2 ${
        darkMode
          ? 'bg-gray-700 border-gray-600'
          : 'bg-white border-gray-300'
      }`}>
        {/* Field List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                darkMode
                  ? field.enabled ? 'bg-gray-600' : 'bg-gray-700/50'
                  : field.enabled ? 'bg-gray-100' : 'bg-gray-50'
              }`}
            >
              {/* Enable Checkbox */}
              <input
                type="checkbox"
                checked={field.enabled}
                onChange={() => toggleField(field.id)}
                className="w-5 h-5 rounded cursor-pointer"
                title="Enable/Disable field"
              />
              
              {/* Label */}
              <span className={`flex-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              } ${!field.enabled ? 'opacity-50' : ''}`}>
                {field.label}
              </span>

              {/* Required Checkbox */}
              <div className="flex items-center gap-1" title="Required for accurate search">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={() => toggleRequired(field.id)}
                  disabled={!field.enabled}
                  className={`w-4 h-4 rounded cursor-pointer ${
                    !field.enabled ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                />
                <span className={`text-xs font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                } ${!field.enabled ? 'opacity-30' : ''}`}>
                  Required
                </span>
              </div>

              {/* Move buttons */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveField(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded transition-colors ${
                    index === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : darkMode
                        ? 'hover:bg-gray-500'
                        : 'hover:bg-gray-200'
                  }`}
                  title="Nach oben"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveField(index, 'down')}
                  disabled={index === fields.length - 1}
                  className={`p-1 rounded transition-colors ${
                    index === fields.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : darkMode
                        ? 'hover:bg-gray-500'
                        : 'hover:bg-gray-200'
                  }`}
                  title="Nach unten"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeField(field.id)}
                className={`p-1 rounded transition-colors ${
                  darkMode
                    ? 'hover:bg-red-600/50 text-red-400'
                    : 'hover:bg-red-100 text-red-600'
                }`}
                title="Entfernen"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add new field */}
        <div className="flex gap-2 pt-2 border-t border-gray-600">
          <input
            type="text"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Neues Feld hinzufügen..."
            className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
              darkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
          <button
            type="button"
            onClick={addField}
            disabled={!newFieldLabel.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              newFieldLabel.trim()
                ? darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Check "Required" to make fields mandatory for accurate search mode
      </p>
    </div>
  );
};

export default OutputFieldsManager;
