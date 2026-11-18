import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';

const API_URL = 'http://localhost:5000/api/categorize';

const COLUMN_LEFT = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Developer",
  "Data Analyst"
];

const COLUMN_RIGHT = [
  "Data Scientist",
  "UI/UX Designer",
  "Networking & IT Support",
  "Digital Marketing",
  "Other / Uncategorized"
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError('');
    setResult(null);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a PDF resume file to analyze.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data?.error || 'Failed to process the resume.');
      }
    } catch (err) {
      console.error('API Error:', err);
      const serverMessage = err.response?.data?.error;
      if (serverMessage) {
        setError(serverMessage);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the backend server. Please make sure the backend is running on port 5000.');
      } else {
        setError(err.message || 'An unexpected error occurred while analyzing the resume.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="site-wrapper">
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <div className="main-container">
        <Header />

        <div className="content-area">
          {!result ? (
            <div className="glass-panel main-panel">
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClear}
                isLoading={isLoading}
              />

              {error && (
                <div className="alert-toast error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="btn-container">
                <button
                  type="button"
                  className={`primary-analyze-btn ${isLoading ? 'is-loading' : ''}`}
                  disabled={!selectedFile || isLoading}
                  onClick={handleUploadAndAnalyze}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="spinner-icon" size={20} />
                      <span>Parsing & Classifying Resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Upload & Classify Resume</span>
                      <ArrowRight size={18} className="arrow-icon" />
                    </>
                  )}
                </button>
              </div>

              <div className="domain-tags-wrapper">
                <span className="tags-label">Supported Target Fields (10 Categories)</span>
                
                <div className="fields-two-columns">
                  <ul className="fields-column">
                    {COLUMN_LEFT.map((field, idx) => (
                      <li key={idx} className="field-list-item">
                        <span className="field-bullet">
                          <CheckCircle2 size={14} />
                        </span>
                        <span className="field-name">{field}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="fields-column">
                    {COLUMN_RIGHT.map((field, idx) => (
                      <li key={idx} className="field-list-item">
                        <span className="field-bullet">
                          <CheckCircle2 size={14} />
                        </span>
                        <span className="field-name">{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ResultCard result={result} onReset={handleReset} />
          )}
        </div>

        <footer className="site-footer">
          <p>
            Resume Categorization System • React & Node.js
          </p>
        </footer>
      </div>
    </div>
  );
}
