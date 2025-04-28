import axios from 'axios';
import { ScrapeRequest, ScrapeResponse, ExportResponse, Question } from '../types';

const API_URL = 'http://localhost:3001/api';

export const scrapeWebsite = async (data: ScrapeRequest): Promise<ScrapeResponse> => {
  try {
    const response = await axios.post(`${API_URL}/scrape`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to scrape website'
      };
    }
    return {
      success: false,
      error: 'An unknown error occurred'
    };
  }
};

export const getScrapingHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scraping history:', error);
    throw error;
  }
};

export const exportToExcel = async (questions: Question[]): Promise<ExportResponse> => {
  try {
    const response = await axios.post(`${API_URL}/export/excel`, { questions });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to export to Excel'
      };
    }
    return {
      success: false,
      error: 'An unknown error occurred'
    };
  }
};