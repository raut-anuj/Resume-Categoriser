import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="badge-wrapper">
        <span className="app-badge">
          <Sparkles size={14} className="badge-sparkle" />
          <span>Intelligent Resume Parser</span>
        </span>
      </div>

      <h1 className="app-title">
        Resume Categorization <span className="gradient-text">Engine</span>
      </h1>

      <p className="app-subtitle">
        Drop your resume in PDF format to instantly parse keywords, evaluate technical domains, 
        and predict the most accurate professional career track.
      </p>
    </header>
  );
}
