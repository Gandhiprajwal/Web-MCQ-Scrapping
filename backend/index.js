import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Create exports directory if it doesn't exist
const exportsDir = join(__dirname, 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/exports', express.static(exportsDir));

// Store scraping history
const scrapingHistory = [];

// Generic scraper function
const scrapeWebsite = async (url, selectors) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set a user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for content to load
    await page.waitForSelector(selectors.questionContainer || 'body', { timeout: 30000 });
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    const questions = [];
    
    // Using the provided selectors or fallback to generic selectors
    const questionElements = $(selectors.questionContainer || '.question-container');
    
    questionElements.each((i, el) => {
      const questionText = $(el).find(selectors.questionText || '.question-text').text().trim();
      
      const options = [];
      $(el).find(selectors.optionsContainer || '.options-container').find(selectors.option || '.option').each((j, opt) => {
        options.push($(opt).text().trim());
      });
      
      const answer = $(el).find(selectors.answer || '.answer').text().trim();
      
      if (questionText) {
        questions.push({
          id: i + 1,
          question: questionText,
          options: options,
          answer: answer || 'Not provided',
          source: url
        });
      }
    });
    
    return questions;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

// Endpoint to scrape a website
app.post('/api/scrape', async (req, res) => {
  const { url, selectors = {} } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    console.log(`Scraping started for: ${url}`);
    const startTime = Date.now();
    
    const questions = await scrapeWebsite(url, selectors);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    const scrapeId = Date.now().toString();
    const historyEntry = {
      id: scrapeId,
      url,
      timestamp: new Date().toISOString(),
      questionCount: questions.length,
      duration: `${duration.toFixed(2)}s`
    };
    
    scrapingHistory.push(historyEntry);
    
    res.json({
      success: true,
      scrapeId,
      questions,
      meta: historyEntry
    });
  } catch (error) {
    console.error('Error in scrape endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get scraping history
app.get('/api/history', (req, res) => {
  res.json(scrapingHistory);
});

// Export to Excel
app.post('/api/export/excel', async (req, res) => {
  const { questions } = req.body;
  
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Valid questions array is required' });
  }
  
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('MCQ Questions');
    
    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 5 },
      { header: 'Question', key: 'question', width: 50 },
      { header: 'Options', key: 'options', width: 50 },
      { header: 'Answer', key: 'answer', width: 30 },
      { header: 'Source', key: 'source', width: 40 }
    ];
    
    // Add rows
    questions.forEach(q => {
      worksheet.addRow({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options.join('\n') : q.options,
        answer: q.answer,
        source: q.source
      });
    });
    
    // Styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    worksheet.getRow(1).font = {
      color: { argb: 'FFFFFFFF' },
      bold: true
    };
    
    const filename = `mcq_questions_${Date.now()}.xlsx`;
    const filepath = join(exportsDir, filename);
    
    await workbook.xlsx.writeFile(filepath);
    
    res.json({
      success: true,
      filename,
      downloadUrl: `/exports/${filename}`
    });
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});