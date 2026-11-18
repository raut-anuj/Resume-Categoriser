import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function FileUpload({ onFileSelect, selectedFile, onClear, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const validateAndSelect = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported. Please select a .pdf file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB. Please choose a smaller PDF resume.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLoading) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="upload-container">
      {!selectedFile ? (
        <div
          className={`dropzone ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                validateAndSelect(e.target.files[0]);
              }
            }}
          />

          <div className="dropzone-glow"></div>

          <div className="upload-icon-wrapper">
            <UploadCloud size={38} className="upload-icon" />
          </div>

          <div className="dropzone-content">
            <h3 className="dropzone-heading">Drop your resume here, or <span className="highlight-browse">browse</span></h3>
            <p className="dropzone-sub">Supports PDF documents up to 10MB</p>
          </div>

          <div className="upload-pill">
            <span>Select PDF File</span>
          </div>
        </div>
      ) : (
        <div className="selected-file-glass">
          <div className="file-info-group">
            <div className="file-badge">
              <FileText size={24} className="file-icon" />
            </div>
            <div className="file-text-details">
              <div className="file-name-row">
                <span className="file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="file-ready-tag">
                  <CheckCircle size={12} /> Ready
                </span>
              </div>
              <span className="file-meta">
                {(selectedFile.size / 1024).toFixed(1)} KB • PDF Document
              </span>
            </div>
          </div>

          {!isLoading && (
            <button
              type="button"
              className="remove-btn"
              onClick={onClear}
              title="Change resume"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="alert-toast error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
