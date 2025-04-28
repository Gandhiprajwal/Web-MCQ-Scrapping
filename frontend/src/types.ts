export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[] | string;
  answer: string;
  source: string;
}

export interface ScrapingHistory {
  id: string;
  url: string;
  timestamp: string;
  questionCount: number;
  duration: string;
}

export interface ScrapeResponse {
  success: boolean;
  scrapeId?: string;
  questions?: Question[];
  meta?: ScrapingHistory;
  error?: string;
}

export interface ExportResponse {
  success: boolean;
  filename?: string;
  downloadUrl?: string;
  error?: string;
}

export interface WebsiteSelectors {
  questionContainer?: string;
  questionText?: string;
  optionsContainer?: string;
  option?: string;
  answer?: string;
}

export interface ScrapeRequest {
  url: string;
  selectors?: WebsiteSelectors;
}