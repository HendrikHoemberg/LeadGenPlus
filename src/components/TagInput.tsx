import type { KeyboardEvent } from 'react';
import React, { useState } from 'react';
import { useSettings } from '../context/useSettings';
import { useTranslation } from '../translations';

interface TagInputProps {
  label: string;
  placeholder: string;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  required?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ 
  label, 
  placeholder, 
  tags, 
  onAddTag, 
  onRemoveTag,
  required = false 
}) => {
  const { darkMode, language } = useSettings();
  const t = useTranslation(language);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        onAddTag(inputValue);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemoveTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      onAddTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && t.requiredMarker}
      </label>
      <div className={`flex flex-wrap gap-2 p-3 rounded-lg border-2 transition-all ${
        darkMode
          ? 'bg-gray-700 border-gray-600 focus-within:border-blue-500'
          : 'bg-white border-gray-300 focus-within:border-blue-500'
      } focus-within:ring-2 focus-within:ring-blue-500/20`}>
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
              darkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="hover:bg-white/20 rounded p-0.5 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className={`flex-1 min-w-[200px] outline-none ${
            darkMode
              ? 'bg-transparent text-white placeholder-gray-400'
              : 'bg-transparent text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>
      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {t.tagInputHelp}
      </p>
    </div>
  );
};

export default TagInput;
