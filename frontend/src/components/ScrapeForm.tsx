import React, { useState } from 'react';
import { Globe, Code, Loader2 } from 'lucide-react';
import { WebsiteSelectors } from '../types';

interface ScrapeFormProps {
  onSubmit: (url: string, selectors: WebsiteSelectors) => Promise<void>;
  isLoading: boolean;
}

const ScrapeForm: React.FC<ScrapeFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectors, setSelectors] = useState<WebsiteSelectors>({
    questionContainer: '',
    questionText: '',
    optionsContainer: '',
    option: '',
    answer: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, selectors);
  };

  const handleSelectorChange = (key: keyof WebsiteSelectors, value: string) => {
    setSelectors({
      ...selectors,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="url" className="block text-gray-700 font-medium mb-2">Website URL</label>
          <div className="flex">
            <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
              <Globe size={18} />
            </div>
            <input
              type="url"
              id="url"
              className="flex-1 border border-gray-300 rounded-r-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/mcq-questions"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Enter the URL of the website containing MCQ questions</p>
        </div>
        
        <div className="mb-6">
          <button 
            type="button" 
            className="text-blue-600 text-sm flex items-center"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Code size={16} className="mr-1" />
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-3">Custom CSS Selectors</h3>
              <p className="text-sm text-gray-600 mb-4">
                Customize the CSS selectors to target specific elements on the website. Leave empty to use default selectors.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Container
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder=".question-container"
                    value={selectors.questionContainer}
                    onChange={(e) => handleSelectorChange('questionContainer', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder=".question-text"
                    value={selectors.questionText}
                    onChange={(e) => handleSelectorChange('questionText', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options Container
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder=".options-container"
                    value={selectors.optionsContainer}
                    onChange={(e) => handleSelectorChange('optionsContainer', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option Element
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder=".option"
                    value={selectors.option}
                    onChange={(e) => handleSelectorChange('option', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer Element
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder=".answer"
                    value={selectors.answer}
                    onChange={(e) => handleSelectorChange('answer', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 size={18} className="animate-spin mr-2" />
              Scraping in progress...
            </span>
          ) : (
            'Start Scraping'
          )}
        </button>
      </form>
    </div>
  );
};

export default ScrapeForm;