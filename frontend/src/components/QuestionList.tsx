import React, { useState } from 'react';
import { Download, Search, Filter, X } from 'lucide-react';
import { Question } from '../types';

interface QuestionListProps {
  questions: Question[];
  onExport: () => Promise<void>;
  isExporting: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onExport, isExporting }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);
  
  React.useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredQuestions(questions);
      return;
    }
    
    const filtered = questions.filter(q => 
      q.question.toLowerCase().includes(term.toLowerCase()) ||
      (typeof q.options === 'string' ? q.options.toLowerCase().includes(term.toLowerCase()) : 
        q.options.some(opt => opt.toLowerCase().includes(term.toLowerCase()))
      ) ||
      q.answer.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredQuestions(filtered);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredQuestions(questions);
  };
  
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500">No questions have been scraped yet. Use the form above to start scraping.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Scraped Questions ({filteredQuestions.length})</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearSearch}
                >
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <button
              className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
              onClick={onExport}
              disabled={isExporting || filteredQuestions.length === 0}
            >
              {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export to Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Answer
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {question.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-md">{question.question}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {Array.isArray(question.options) ? (
                    <ul className="list-disc pl-5">
                      {question.options.map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  ) : (
                    question.options
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {question.answer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionList;