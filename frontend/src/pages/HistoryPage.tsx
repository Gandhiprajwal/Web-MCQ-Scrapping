import React, { useState, useEffect } from 'react';
import ScrapingHistoryList from '../components/ScrapingHistory';
import { getScrapingHistory } from '../api/scraperService';
import { ScrapingHistory } from '../types';
import { Loader } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScrapingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getScrapingHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load scraping history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Scraping History</h1>
        <p className="text-gray-600">
          View a log of all your previous scraping sessions and their results.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader size={24} className="animate-spin mr-2" />
          <span>Loading history...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <ScrapingHistoryList history={history} />
      )}
    </div>
  );
};

export default HistoryPage;