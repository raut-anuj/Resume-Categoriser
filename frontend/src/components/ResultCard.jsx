import React from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  Tag, 
  FileText, 
  Layers, 
  BarChart3,
  HelpCircle,
  Award,
  Zap
} from 'lucide-react';

export default function ResultCard({ result, onReset }) {
  if (!result) return null;

  const isOther = result.category === 'Other';

  return (
    <div className="result-glass-card">
      <div className="result-top-bar">
        <div className={`status-pill ${isOther ? 'pill-warning' : 'pill-success'}`}>
          {isOther ? <HelpCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{isOther ? 'Low Domain Correlation' : 'Analysis Complete'}</span>
        </div>

        <div className="file-chip">
          <FileText size={14} />
          <span>{result.fileName}</span>
          <span className="file-chip-divider">•</span>
          <span>{result.pages} {result.pages === 1 ? 'page' : 'pages'}</span>
        </div>
      </div>

      <div className="hero-category-box">
        <div className="hero-decor-circle"></div>
        <div className="hero-badge">
          <Award size={14} />
          <span>Best Matched Domain</span>
        </div>
        <h2 className="hero-category-name">{result.category}</h2>

        <div className="confidence-container">
          <div className="confidence-labels">
            <span>Confidence Match Score</span>
            <span className="confidence-num">{result.confidence}%</span>
          </div>
          <div className="confidence-track">
            <div 
              className="confidence-fill" 
              style={{ width: `${result.confidence}%` }}
            >
              <div className="shimmer-effect"></div>
            </div>
          </div>
        </div>
      </div>

      {result.matchedKeywords && result.matchedKeywords.length > 0 && (
        <div className="skills-block">
          <div className="section-label-row">
            <div className="section-icon-wrap">
              <Zap size={15} />
            </div>
            <h4>Identified Skills & Keywords ({result.matchedKeywords.length})</h4>
          </div>
          <div className="skills-cloud">
            {result.matchedKeywords.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.topScores && result.topScores.length > 1 && (
        <div className="correlations-block">
          <div className="section-label-row">
            <div className="section-icon-wrap">
              <BarChart3 size={15} />
            </div>
            <h4>Category Correlation Breakdown</h4>
          </div>
          <div className="correlation-bars">
            {result.topScores.map((item, index) => {
              const maxScore = result.topScores[0].score || 1;
              const percent = Math.round((item.score / maxScore) * 100);
              return (
                <div key={index} className="correlation-row">
                  <div className="correlation-header">
                    <span className="cat-title">{item.category}</span>
                    <span className="cat-pts">{item.score} pts</span>
                  </div>
                  <div className="cor-track">
                    <div 
                      className="cor-fill" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="result-footer-action">
        <button type="button" className="action-reset-btn" onClick={onReset}>
          <RotateCcw size={16} />
          <span>Upload Another Resume</span>
        </button>
      </div>
    </div>
  );
}
