import React, { useState } from "react";
import ScrapeForm from "../components/ScrapeForm";
import QuestionList from "../components/QuestionList";
import { scrapeWebsite, exportToExcel } from "../api/scraperService";
import { Question, WebsiteSelectors } from "../types";
import { AlertTriangle, CheckCircle } from "lucide-react";

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleScrape = async (url: string, selectors: WebsiteSelectors) => {
    setIsLoading(true);
    setAlert(null);

    try {
      const response = await scrapeWebsite({ url, selectors });

      if (response.success && response.questions) {
        setQuestions(response.questions);
        setAlert({
          type: "success",
          message: `Successfully scraped ${response.questions.length} questions from ${url}`,
        });
      } else {
        setAlert({
          type: "error",
          message: response.error || "Failed to scrape the website",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while scraping the website",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (questions.length === 0) {
      setAlert({
        type: "error",
        message: "No questions to export",
      });
      return;
    }

    setIsExporting(true);

    try {
      const response = await exportToExcel(questions);

      if (response.success && response.downloadUrl) {
        // Create a download link
        const a = document.createElement("a");
        a.href = `${import.meta.env.VITE_API_URL}${response.downloadUrl}`;
        a.download = response.filename || "mcq_questions.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setAlert({
          type: "success",
          message: "Questions exported to Excel successfully",
        });
      } else {
        setAlert({
          type: "error",
          message: response.error || "Failed to export questions",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while exporting to Excel",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          MCQ Question Scraper
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Extract multiple-choice questions from any website and export them to
          Excel with just a few clicks.
        </p>
      </div>

      {alert && (
        <div
          className={`mb-6 p-4 rounded-md ${
            alert.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {alert.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {alert.message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Start Scraping
          </h2>
          <ScrapeForm onSubmit={handleScrape} isLoading={isLoading} />
        </div>

        <div>
          <QuestionList
            questions={questions}
            onExport={handleExport}
            isExporting={isExporting}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
