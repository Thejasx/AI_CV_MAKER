import React, { useState } from 'react';
import { Upload, FileText, FileCode, CheckCircle, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import { parseCVFileApi } from '../services/api';

const SAMPLE_CV = `JANE DOE
Software Engineer | Full-Stack Specialist
San Francisco, CA | (555) 019-2834 | jane.doe@example.com | linkedin.com/in/janedoe | github.com/janedoe

PROFESSIONAL SUMMARY
Dynamic Software Engineer with 4+ years of experience building modern web applications. Skilled in React, JavaScript, Node.js, Express, and REST APIs. Passionate about writing clean code and improving system performance.

WORK EXPERIENCE
Full Stack Developer | Tech Innovations Inc. | San Francisco, CA | 2022 - Present
- Developed web features using React and Node.js for an e-commerce platform with over 100k monthly active users.
- Built REST API endpoints in Express to handle user login and order processing.
- Reduced API response times by 25% through database query optimizations.
- Worked closely with UX designers to implement responsive Tailwind CSS layouts.

Junior Web Developer | CodeCrafters | San Jose, CA | 2020 - 2022
- Maintained legacy JavaScript applications and converted key modules to React.
- Fixed front-end bugs and improved cross-browser compatibility.
- Wrote unit tests to increase code coverage by 15%.

EDUCATION
Bachelor of Science in Computer Science | San Jose State University | 2016 - 2020

SKILLS
Frontend: JavaScript, React, HTML5, CSS3, Tailwind CSS, Redux
Backend: Node.js, Express, MongoDB, REST APIs, SQL
Tools: Git, GitHub, VS Code, Postman, Webpack`;

export default function CVUpload({ rawCVText, setRawCVText, onNext }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const data = await parseCVFileApi(file);
      if (data.success) {
        setRawCVText(data.rawCVText);
        setUploadedFileName(data.filename);
      } else {
        setUploadError(data.message || 'Failed to parse document.');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Error uploading file. Please check file format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const loadSampleCV = () => {
    setRawCVText(SAMPLE_CV);
    setUploadedFileName('Sample_Software_Engineer_CV.txt');
    setUploadError('');
  };

  const wordCount = rawCVText ? rawCVText.trim().split(/\s+/).length : 0;
  const charCount = rawCVText ? rawCVText.length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Step 1: Multi-Modal Ingestion Engine
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload or Paste Your Current Resume
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Our backend engine extracts and sanitizes raw text from your PDF or DOCX document, preparing it for AI ATS optimization.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Document (.pdf / .docx)
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'paste'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Paste Raw Text
        </button>
      </div>

      {/* Upload Zone */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`glass-panel p-8 rounded-2xl border-2 border-dashed transition-all text-center relative ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : uploadedFileName
              ? 'border-emerald-500/50 bg-emerald-50/30'
              : 'border-slate-300 hover:border-indigo-400 bg-white'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">
                Parsing document using <code className="text-indigo-600 font-mono">pdf-parse</code> / <code className="text-indigo-600 font-mono">mammoth</code>...
              </p>
            </div>
          ) : uploadedFileName ? (
            <div className="py-4 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-emerald-800 font-bold text-sm">{uploadedFileName}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Extracted {wordCount} words ({charCount} characters) successfully
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFileName('');
                  setRawCVText('');
                }}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 mt-2 z-10 font-semibold"
              >
                <X className="w-3.5 h-3.5" /> Remove & upload another
              </button>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center gap-3 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                <Upload className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Drag and drop your resume file here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports <span className="text-indigo-600 font-semibold">PDF (.pdf)</span>, <span className="text-indigo-600 font-semibold">Word (.docx)</span>, or TXT
                </p>
              </div>
              <span className="mt-2 inline-flex items-center text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl shadow-sm">
                Browse Files
              </span>
            </div>
          )}
        </div>
      )}

      {/* Paste Zone */}
      {activeTab === 'paste' && (
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-600" />
              Raw CV Plain Text
            </label>
            <span className="text-[11px] font-semibold text-slate-500">
              {wordCount} words | {charCount} chars
            </span>
          </div>
          <textarea
            value={rawCVText}
            onChange={(e) => setRawCVText(e.target.value)}
            placeholder="Paste your full resume text here (Contact details, Summary, Work experience, Education, Skills)..."
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={loadSampleCV}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4 flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Load Sample Developer CV
        </button>

        <button
          onClick={onNext}
          disabled={!rawCVText || rawCVText.trim().length < 20}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continue to Job Description →
        </button>
      </div>

    </div>
  );
}
